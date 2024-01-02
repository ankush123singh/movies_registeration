var express = require('express');
var router = express.Router();
var pool=require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');


router.get('/adminlogin', function(req, res, next) {
  res.render('logininterface',{message:''});
});

router.post('/check_admin_login', function(req, res, next) {
    try{
    pool.query("select * from admins where (emailid=? or mobileno=?) and password=?",[req.body.emailid, req.body.emailid, req.body.password],function(error,result){
if(error)
{
    res.render('logininterface',{message:'Server Error'}); 
}
else
{ if(result.length==1)
{ localStorage.setItem('ADMIN',JSON.stringify(result[0]))
    res.render('dashboard',{data:result[0]});
}
else
{
    res.render('logininterface',{message:'Invalid Email/Mobileno/Password'});
}
}
    })


    }
    catch(e){
    res.render('logininterface',{message:''});
    }
  });

  router.get('/logout', function(req, res, next) {
    localStorage.clear()
    res.render('logininterface',{message:''});
  });
module.exports = router;