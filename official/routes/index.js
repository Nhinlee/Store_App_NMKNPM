var express = require('express');
var router = express.Router();
const passport = require('../config/passport');



/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.isAuthenticated())
  {
    if (req.user.role == "admin")
      res.redirect('/admin');
    else
    {
      if (req.user.role == "employee")
        res.redirect('/employee');
    }
  }
  let erro = req.query.erro;
  if (erro === undefined)
    erro = 0;
  
  res.render("pages/login", {erro: erro});
});

router.post('/',passport.authenticate('local', {successRedirect: '/login-OK',
                                                     failureRedirect: '/?erro=1'}));

router.get('/login-OK', function(req, res, next) {
  if (req.isAuthenticated())
  {
    if (req.user.role == "admin")
    {
      res.redirect('/admin');
    }
    else{
      if (req.user.role == "employee")
      {
        res.redirect('/employee')
      }
    }
  }
  else{
    res.status(404).send({message: "page not found"});
  }
});

router.get('/logout', function(req, res, next) {
  if (req.isAuthenticated())
  {
    req.logOut();
    res.redirect('/');
  }
  else{
    res.redirect('/');
  }
});

module.exports = router;
