const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    image: { type: String, default: '' },
    pricePerPerson: { type: Number, default: 15 },
    destinationPrice: { type: Number, default: 20 },
  },
  { timestamps: true }
);

const SiteModel = mongoose.model('SitesTbl', SiteSchema, 'SitesTbl');
module.exports = SiteModel;
