const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');
const Proposal = require('../models/Proposal');
const EnquiryModels = require('../models/EnquiryModel');

router.get('/', ensureAuthenticated, (req, res) => {
  Proposal.find(
    {
      userId: req.user.id
    },
    function(err, proposals) {
      if (err) {
        console.log(err);
      } else {
        res.render('proposals/index', {
          proposals: proposals
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

router.post('/search-and-add', ensureAuthenticated, (req, res) => {
  if (typeof req.body.name == 'string' || req.body.name instanceof String) {
    var p_arr = [];
    var p_obj = {
      name: req.body.name,
      qty: parseInt(req.body.qty, 10),
      description: req.body.description,
      rate: parseInt(req.body.rate, 10),
      cost: parseInt(req.body.cost, 10),
      modelId: req.body.modelId
    };
    p_arr.push(p_obj);
    const newProposal = new Proposal({
      enquiryId: req.body.enquiryId,
      userId: req.user.id,
      proposal: p_arr
    });
    newProposal
      .save()
      .then(proposal => {
        Proposal.find(
          {
            userId: req.user.id
          },
          function(err, proposals) {
            if (err) {
              console.log(err);
            } else {
              res.render('proposals/index', {
                proposals: proposals
              });
            }
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    var len = req.body.modelId.length;
    var p_arr1 = [];
    for (let i = 0; i < len; i++) {
      var p_obj1 = {
        name: req.body.name[i],
        qty: parseInt(req.body.qty[i], 10),
        description: req.body.description[i],
        rate: parseInt(req.body.rate[i], 10),
        cost: parseInt(req.body.cost[i], 10),
        modelId: req.body.modelId[i]
      };
      p_arr1.push(p_obj1);
    }

    const newProposal = new Proposal({
      enquiryId: req.body.enquiryId[0],
      userId: req.user.id,
      proposal: p_arr1
    });
    newProposal
      .save()
      .then(proposal => {
        Proposal.find(
          {
            userId: req.user.id
          },
          function(err, proposals) {
            if (err) {
              console.log(err);
            } else {
              res.render('proposals/index', {
                proposals: proposals
              });
            }
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  }
});

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
