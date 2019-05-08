const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');
const EnquiryModels = require('../models/EnquiryModel');

// Load Enquiry Model
router.get('/', ensureAuthenticated, (req, res) => {
  EnquiryModels.find(
    {
      userId: req.user.id
    },
    function(err, enquiryModels) {
      if (err) {
        console.log(err);
      } else {
        res.render('enquiryModels/index', {
          enquiryModels: enquiryModels
        });
      }
    }
  );
});

router.get('/data/:enqId', ensureAuthenticated, (req, res) => {
  EnquiryModels.find(
    {
      enquiryId: req.params.enqId
    },
    function(err, response) {
      if (err) {
        console.log(err);
      } else {
        res.render('partials/enquiryTable', {
          layout: false,
          data: response
        });
      }
    }
  );
});

router.get('/search', ensureAuthenticated, (req, res) => {
  EnquiryModels.find(
    {
      $and: [
        { 'model.name': { $regex: req.query.item, $options: 'i' } },
        { enquiryId: req.query.enqId }
      ]
    },
    function(err, response) {
      if (err) {
        console.log(err);
      } else {
        var data = [];
        response.forEach(function(enquiry) {
          enquiry['model'].forEach(function(modelData) {
            var modelNameLower = modelData.name.toLowerCase();
            if (modelNameLower.includes(req.query.item)) {
              var a = {
                enquiryId: req.query.enqId
              };
              var newObj = { ...modelData.toObject(), ...a };
              data.push(newObj);
            }
          });
        });
        res.render('partials/enquiryTable', {
          layout: false,
          data: data
        });
      }
    }
  );
});

module.exports = router;
