const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const EnquirySchema = new Schema({
  enquiryId: {
    type: String
  },
  userId: {
    type: String
  },
  model: [
    {
      modelId: String,
      name: String,
      qty: Number,
      description: String,
      rate: Number,
      cost: Number
    }
  ]
});
var collectionName = 'enquiryModels';

module.exports = mongoose.model('enquiryModels', EnquirySchema, collectionName);
