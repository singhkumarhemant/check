const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProposalSchema = new Schema({
  enquiryId: {
    type: String
  },
  userId: {
    type: String
  },
  proposal: [
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
// mongoose.model('proposals', ProposalSchema);
var collectionName = 'proposals';

module.exports = mongoose.model('proposals', ProposalSchema, collectionName);
