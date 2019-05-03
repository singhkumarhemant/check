const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');
const Proposal = require('../models/Proposal');
const EnquiryModels = require('../models/EnquiryModel');

// require('../models/Proposal');
// const Proposal = mongoose.model('proposals');

router.get('/', ensureAuthenticated, (req, res) => {
  Proposal.find(
    {
      userId: req.user.id
    },
    function(err, proposals) {
      if (err) {
        console.log(err);
      } else {
        var uniqueProposals = [];
        uniqueProposals = removeDuplicates(proposals, 'modelId');
        // console.log(n);
        res.render('proposals/index', {
          proposals: uniqueProposals
        });
      }
    }
  );
});

function removeDuplicates(originalArray, objKey) {
  var trimmedArray = [];
  var values = [];
  var value;

  for (var i = 0; i < originalArray.length; i++) {
    value = originalArray[i][objKey];

    if (values.indexOf(value) === -1) {
      trimmedArray.push(originalArray[i]);
      values.push(value);
    }
  }

  return trimmedArray;
}

router.post('/add', ensureAuthenticated, (req, res) => {
  var newProposal = req.body.mycheck;
  if (typeof newProposal === 'string' || newProposal instanceof String) {
    EnquiryModels.find({ 'model.modelId': newProposal }, function(
      err,
      enquiryModels
    ) {
      if (err) {
        console.log(err);
      } else {
        var finalObj;
        var modelArray = enquiryModels[0].model;
        for (let i = 0; i < modelArray.length; i++) {
          if (modelArray[i].modelId == newProposal) {
            finalObj = modelArray[i];
          }
        }

        var proposalData = new Proposal(finalObj.toObject());
        proposalData.save().then(proposal => {
          req.flash('success_msg', 'Proposal Added');
          res.render('index');
        });
      }
    });
  } else {
    for (let j = 0; j < newProposal.length; j++) {
      EnquiryModels.find({ 'model.modelId': newProposal[j] }, function(
        err,
        enquiryModels
      ) {
        if (err) {
          console.log(err);
        } else {
          var finalObjMulti = {};
          finalObjMulti.userId = enquiryModels[0].userId;
          var modelArray = enquiryModels[0].model;
          for (let i = 0; i < modelArray.length; i++) {
            if (modelArray[i].modelId == newProposal[j]) {
              finalObjMulti.name = modelArray[i].name;
              finalObjMulti.modelId = modelArray[i].modelId;
              finalObjMulti.qty = modelArray[i].qty;
              finalObjMulti.description = modelArray[i].description;
              finalObjMulti.rate = modelArray[i].rate;
              finalObjMulti.cost = modelArray[i].cost;
            }
          }
          var proposalData = new Proposal(finalObjMulti);
          proposalData.save().then(proposal => {});
        }
      });
    }
    req.flash('success_msg', 'Proposal Added');
    res.render('index');
  }
});

module.exports = router;
