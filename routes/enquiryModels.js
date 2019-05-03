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



module.exports = router;
