const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UsersTbl', required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'SitesTbl', required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model('ReviewsTbl', ReviewSchema, 'ReviewsTbl');
module.exports = ReviewModel;
