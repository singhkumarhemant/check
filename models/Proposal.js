const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProposalSchema = new Schema({
  name: String,
  modelId: String,
  qty: Number,
  description: String,
  rate: Number,
  cost: Number,
  userId: String
});
// mongoose.model('proposals', ProposalSchema);
var collectionName = 'proposals';

module.exports = mongoose.model('proposals', ProposalSchema, collectionName);
