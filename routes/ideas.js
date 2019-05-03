const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas,
      });
    });
});

module.exports = router;