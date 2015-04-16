var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/add', function(req, res, next) {
  res.render('resultpage', {title: 'Thank you!', resultid:'additemstatus', 
  	result: 'Completed. Quantity ' + req.body.quantity + ' of ' + req.body.item + ' added.'});
});

module.exports = router;
