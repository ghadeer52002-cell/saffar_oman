import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const conStr =
"mongodb://Hudadb:huda12345@ac-jmamwe0-shard-00-00.bl8udfo.mongodb.net:27017,ac-jmamwe0-shard-00-01.bl8udfo.mongodb.net:27017,ac-jmamwe0-shard-00-02.bl8udfo.mongodb.net:27017/test?ssl=true&replicaSet=atlas-a962a8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isValidBookingTime = (time) => {
    return time && time >= '06:00' && time <= '20:00';
    
};

mongoose.connect(conStr)
.then(async () => {
    console.log("Database Connected Successfully!");

    const db = mongoose.connection.db;

    const existingAdmin = await db.collection('users').findOne({
        email: 'admin@gmail.com'
    });

    if (!existingAdmin) {
        await db.collection('users').insertOne({
            fullName: 'Main Admin',
            email: 'admin@gmail.com',
            phone: '99999999',
            password: 'admin12345',
            role: 'admin',
            profileImage: '',
            createdAt: new Date()
        });

        console.log("Admin Created");
    }
})
.catch((error) => {
    console.log("Database Error:");
    console.log(error);
});

app.get('/', async (req, res) => {
    try {
        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();

        res.json({
            success: true,
            database: mongoose.connection.name,
            collections
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        const db = mongoose.connection.db;
        const cleanEmail = email.trim().toLowerCase();

        const existingUser = await db.collection('users').findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const newUser = {
            fullName,
            email: cleanEmail,
            phone,
            password,
            role: role || 'user',
            profileImage: '',
            createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);

        res.json({
            success: true,
            message: 'registered',
            user: {
                _id: result.insertedId,
                ...newUser
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const db = mongoose.connection.db;
        const cleanEmail = email.trim().toLowerCase();

        const user = await db.collection('users').findOne({
            email: cleanEmail,
            password
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.json({
            success: true,
            message: 'login success',
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put('/api/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            fullName,
            email,
            phone,
            profileImage,
            currentPassword,
            newPassword
        } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user id'
            });
        }

        const db = mongoose.connection.db;

        const user = await db.collection('users').findOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const existingEmail = await db.collection('users').findOne({
            email: cleanEmail,
            _id: {
                $ne: new mongoose.Types.ObjectId(id)
            }
        });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const updateData = {
            fullName,
            email: cleanEmail,
            phone,
            profileImage,
            updatedAt: new Date()
        };

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is required'
                });
            }

            if (currentPassword !== user.password) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            updateData.password = newPassword;
        }

        await db.collection('users').updateOne(
            {
                _id: new mongoose.Types.ObjectId(id)
            },
            {
                $set: updateData
            }
        );

        const updatedUser = await db.collection('users').findOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        res.json({
            success: true,
            message: 'profile updated',
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const totalPlaces = await db.collection('sites').countDocuments();
        const totalBookings = await db.collection('bookings').countDocuments();
        const totalReviews = await db.collection('reviews').countDocuments();
        const totalUsers = await db.collection('users').countDocuments();

        res.json({
            success: true,
            data: {
                lastUpdate: new Date(),
                totalPlaces,
                totalBookings,
                totalReviews,
                totalUsers
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const users = await db.collection('users')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            fullName,
            email,
            phone,
            password,
            role,
            profileImage
        } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user id'
            });
        }

        const db = mongoose.connection.db;

        await db.collection('users').updateOne(
            {
                _id: new mongoose.Types.ObjectId(id)
            },
            {
                $set: {
                    fullName,
                    email: email.trim().toLowerCase(),
                    phone,
                    password,
                    role,
                    profileImage: profileImage || '',
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: 'user updated'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user id'
            });
        }

        const db = mongoose.connection.db;

        await db.collection('users').deleteOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        res.json({
            success: true,
            message: 'user deleted'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get('/api/sites', async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const sites = await db.collection('sites')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            sites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get('/api/sites/featured', async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const sites = await db.collection('sites')
            .find({})
            .sort({
                saveCount: -1,
                clickCount: -1,
                createdAt: -1
            })
            .limit(6)
            .toArray();

        res.json({
            success: true,
            sites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/api/sites/add', async (req, res) => {
    try {
        const {
            title,
            location,
            image,
            description,
            pricePerDay
        } = req.body;

        const db = mongoose.connection.db;

        const newSite = {
            title,
            location,
            image,
            description,
            pricePerDay: Number(pricePerDay || 0),
            clickCount: 0,
            saveCount: 0,
            savedBy: [],
            isActive: true,
            createdAt: new Date()
        };

        const result = await db.collection('sites').insertOne(newSite);

        res.json({
            success: true,
            message: 'site added',
            site: {
                _id: result.insertedId,
                ...newSite
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put('/api/sites/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            location,
            image,
            description,
            pricePerDay,
            isActive
        } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid site id'
            });
        }

        const db = mongoose.connection.db;

        await db.collection('sites').updateOne(
            {
                _id: new mongoose.Types.ObjectId(id)
            },
            {
                $set: {
                    title,
                    location,
                    image,
                    description,
                    pricePerDay: Number(pricePerDay || 0),
                    isActive: isActive === undefined ? true : Boolean(isActive),
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: 'site updated'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.delete('/api/sites/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid site id'
            });
        }

        const db = mongoose.connection.db;

        await db.collection('sites').deleteOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        res.json({
            success: true,
            message: 'site deleted'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put('/api/sites/:id/click', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid site id'
            });
        }

        const db = mongoose.connection.db;

        await db.collection('sites').updateOne(
            {
                _id: new mongoose.Types.ObjectId(id)
            },
            {
                $inc: {
                    clickCount: 1
                },
                $set: {
                    lastClickedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: 'click counted'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put('/api/sites/:id/save', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid site id'
            });
        }

        const db = mongoose.connection.db;

        const site = await db.collection('sites').findOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        const alreadySaved = site?.savedBy?.includes(userId);

        if (alreadySaved) {
            await db.collection('sites').updateOne(
                {
                    _id: new mongoose.Types.ObjectId(id)
                },
                {
                    $pull: {
                        savedBy: userId
                    },
                    $inc: {
                        saveCount: -1
                    },
                    $set: {
                        updatedAt: new Date()
                    }
                }
            );

            return res.json({
                success: true,
                message: 'unsaved'
            });
        }

        await db.collection('sites').updateOne(
            {
                _id: new mongoose.Types.ObjectId(id)
            },
            {
                $addToSet: {
                    savedBy: userId
                },
                $inc: {
                    saveCount: 1
                },
                $set: {
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: 'saved'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get('/api/admin/bookings', async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const bookings = await db.collection('bookings')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/api/bookings/add', async (req, res) => {
    try {
        const {
            userId,
            siteId,
            date,
            time,
            pickup,
            pickupLat,
            pickupLng,
            days,
            travelers,
            privateGuide,
            mealPackage,
            notes,
            paymentMethod,
            status
        } = req.body;

        if (!isValidObjectId(userId) || !isValidObjectId(siteId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user or place id'
            });
        }

        if (!isValidBookingTime(time)) {
            return res.status(400).json({
                success: false,
                message: 'Booking time must be between 6:00 AM and 8:00 PM'
            });
        }

        const db = mongoose.connection.db;

        const user = await db.collection('users').findOne({
            _id: new mongoose.Types.ObjectId(userId)
        });

        const site = await db.collection('sites').findOne({
            _id: new mongoose.Types.ObjectId(siteId)
        });

        if (!user || !site) {
            return res.status(400).json({
                success: false,
                message: 'User or place not found'
            });
        }

        const numberOfDays = Math.max(1, Number(days || 1));
        const numberOfTravelers = Math.max(1, Number(travelers || 1));
        const pricePerDay = Number(site.pricePerDay || 0);

        const baseTotal = pricePerDay * numberOfDays * numberOfTravelers;
        const guideFee = privateGuide ? 15 * numberOfDays : 0;
        const mealFee = mealPackage ? 5 * numberOfTravelers * numberOfDays : 0;
        const total = baseTotal + guideFee + mealFee;

        const newBooking = {
            userId,
            userName: user.fullName,
            userEmail: user.email,
            siteId,
            title: site.title,
            location: site.location,
            image: site.image,
            date,
            time,
            pickup,
            pickupLat: pickupLat ? Number(pickupLat) : null,
            pickupLng: pickupLng ? Number(pickupLng) : null,
            days: numberOfDays,
            travelers: numberOfTravelers,
            privateGuide: Boolean(privateGuide),
            mealPackage: Boolean(mealPackage),
            notes,
            paymentMethod,
            pricePerDay,
            baseTotal,
            guideFee,
            mealFee,
            total,
            status: status || 'pending',
            isConfirmed: false,
            confirmedAt: null,
            createdAt: new Date()
        };

        const result = await db.collection('bookings').insertOne(newBooking);

        res.json({
            success: true,
            message: 'booking added',
            booking: {
                _id: result.insertedId,
                ...newBooking
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put('/api/bookings/confirm/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentMethod } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking id'
            });
        }

        const db = mongoose.connection.db;

        const booking = await db.collection('bookings').findOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        await db.collection('bookings').updateOne(
            {
                _id: new mongoose.Types.ObjectId(id)
            },
            {
                $set: {
                    status: 'confirmed',
                    paymentMethod,
                    isConfirmed: true,
                    confirmedAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        const updatedBooking = await db.collection('bookings').findOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        res.json({
            success: true,
            message: 'Booking confirmed successfully',
            booking: updatedBooking
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/api/admin/bookings/add', async (req, res) => {
    try {
        const { userId, siteId, date, time, days, status } = req.body;

        if (!isValidObjectId(userId) || !isValidObjectId(siteId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user or place id'
            });
        }

        if (!isValidBookingTime(time)) {
            return res.status(400).json({
                success: false,
                message: 'Booking time must be between 6:00 AM and 8:00 PM'
            });
        }

        const db = mongoose.connection.db;

        const user = await db.collection('users').findOne({
            _id: new mongoose.Types.ObjectId(userId)
        });

        const site = await db.collection('sites').findOne({
            _id: new mongoose.Types.ObjectId(siteId)
        });

        if (!user || !site) {
            return res.status(400).json({
                success: false,
                message: 'User or place not found'
            });
        }

        const numberOfDays = Math.max(1, Number(days || 1));
        const pricePerDay = Number(site.pricePerDay || 0);
        const total = pricePerDay * numberOfDays;

        const newBooking = {
            userId,
            userName: user.fullName,
            userEmail: user.email,
            siteId,
            title: site.title,
            location: site.location,
            image: site.image,
            date,
            time,
            days: numberOfDays,
            travelers: 1,
            privateGuide: false,
            mealPackage: false,
            pricePerDay,
            baseTotal: total,
            guideFee: 0,
            mealFee: 0,
            total,
            status: status || 'pending',
            isConfirmed: status === 'confirmed',
            confirmedAt: status === 'confirmed' ? new Date() : null,
            createdAt: new Date()
        };

        const result = await db.collection('bookings').insertOne(newBooking);

        res.json({
            success: true,
            message: 'booking added',
            booking: {
                _id: result.insertedId,
                ...newBooking
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put('/api/admin/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, siteId, date, time, days, status } = req.body;

        if (!isValidObjectId(id) || !isValidObjectId(userId) || !isValidObjectId(siteId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking, user, or place id'
            });
        }

        if (!isValidBookingTime(time)) {
            return res.status(400).json({
                success: false,
                message: 'Booking time must be between 6:00 AM and 8:00 PM'
            });
        }

        const db = mongoose.connection.db;

        const user = await db.collection('users').findOne({
            _id: new mongoose.Types.ObjectId(userId)
        });

        const site = await db.collection('sites').findOne({
            _id: new mongoose.Types.ObjectId(siteId)
        });

        if (!user || !site) {
            return res.status(400).json({
                success: false,
                message: 'User or place not found'
            });
        }

        const currentBooking = await db.collection('bookings').findOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        const numberOfDays = Math.max(1, Number(days || 1));
        const pricePerDay = Number(site.pricePerDay || 0);
        const total = pricePerDay * numberOfDays;
        const isConfirmed = status === 'confirmed';

        await db.collection('bookings').updateOne(
            {
                _id: new mongoose.Types.ObjectId(id)
            },
            {
                $set: {
                    userId,
                    userName: user.fullName,
                    userEmail: user.email,
                    siteId,
                    title: site.title,
                    location: site.location,
                    image: site.image,
                    date,
                    time,
                    days: numberOfDays,
                    travelers: 1,
                    privateGuide: false,
                    mealPackage: false,
                    pricePerDay,
                    baseTotal: total,
                    guideFee: 0,
                    mealFee: 0,
                    total,
                    status,
                    isConfirmed,
                    confirmedAt: isConfirmed
                        ? currentBooking?.confirmedAt || new Date()
                        : null,
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: 'booking updated'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.delete('/api/admin/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking id'
            });
        }

        const db = mongoose.connection.db;

        await db.collection('bookings').deleteOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        res.json({
            success: true,
            message: 'booking deleted'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get('/api/bookings/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const db = mongoose.connection.db;

        const bookings = await db.collection('bookings')
            .find({
                userId,
                status: 'confirmed'
            })
            .sort({
                confirmedAt: -1,
                createdAt: -1
            })
            .toArray();

        res.json({
            success: true,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const db = mongoose.connection.db;

        const bookings = await db.collection('bookings')
            .find({ userId })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get('/api/reviews/public', async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const reviews = await db.collection('reviews')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            reviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/api/reviews/add', async (req, res) => {
    try {
        const {
            userId,
            userName,
            userEmail,
            userProfileImage,
            siteId,
            siteTitle,
            comment
        
        } = req.body;

        const db = mongoose.connection.db;

        const newReview = {
            userId,
            userName,
            userEmail,
            userProfileImage: userProfileImage || '',
            siteId: siteId || null,
            siteTitle: siteTitle || 'Saffar Oman',
            comment,
            adminReply: '',
            isReplied: false,
            repliedAt: null,
            createdAt: new Date()
        };

        const result = await db.collection('reviews').insertOne(newReview);

        res.json({
            success: true,
            message: 'review added',
            review: {
                _id: result.insertedId,
                ...newReview
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.delete('/api/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.query;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review id'
            });
        }

        const db = mongoose.connection.db;

        const review = await db.collection('reviews').findOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const isOwner = review.userId === userId;
        const isAdmin = role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete this review'
            });
        }

        await db.collection('reviews').deleteOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        res.json({
            success: true,
            message: 'review deleted'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get('/api/admin/reviews', async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const reviews = await db.collection('reviews')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            reviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put('/api/admin/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review id'
            });
        }

        const db = mongoose.connection.db;

        await db.collection('reviews').updateOne(
            {
                _id: new mongoose.Types.ObjectId(id)
            },
            {
                $set: {
                    comment,
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: 'review updated'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put('/api/admin/reviews/:id/reply', async (req, res) => {
    try {
        const { id } = req.params;
        const { adminReply } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review id'
            });
        }

        const db = mongoose.connection.db;

        await db.collection('reviews').updateOne(
            {
                _id: new mongoose.Types.ObjectId(id)
            },
            {
                $set: {
                    adminReply,
                    isReplied: Boolean(adminReply),
                    repliedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: 'reply saved'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.delete('/api/admin/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review id'
            });
        }

        const db = mongoose.connection.db;

        await db.collection('reviews').deleteOne({
            _id: new mongoose.Types.ObjectId(id)
        });

        res.json({
            success: true,
            message: 'review deleted'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
    app.post('/api/users/add', async (req, res) => {
    try {

        const {
            fullName,
            email,
            phone,
            password,
            role
        } = req.body;

        const db = mongoose.connection.db;

        const cleanEmail = email.trim().toLowerCase();

        const existingUser = await db.collection('users').findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const newUser = {
            fullName,
            email: cleanEmail,
            phone,
            password,
            role: role || 'user',
            profileImage: '',
            createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);

        res.json({
            success: true,
            message: 'user added',
            user: {
                _id: result.insertedId,
                ...newUser
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

});

app.listen(3002, () => {
    console.log("Server Connected on port 3002...");
});