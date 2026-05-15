const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersTbl', required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'SitesTbl', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    privateGuide: { type: Boolean, default: false },
    mealPackage: { type: Boolean, default: false },
    travelers: { type: Number, default: 1 },
    notes: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['visa', 'cash'], default: 'visa' },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model('BookingsTbl', BookingSchema, 'BookingsTbl');
module.exports = BookingModel;
