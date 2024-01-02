var express=require('express');
var router=express.Router();
var pool=require('./pool') 
var fs=require('fs')
var upload=require('./multer')
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');


router.get("/movie_interface",function(req,res,next) {

    try{
 var admin=JSON.parse(localStorage.getItem('ADMIN'))
 if(admin==null)
   { res.render('logininterface',{message:''});}
   else
   {res.render('movieinterface',{message:''});}
}    
    catch(e)
    {
        res.render('logininterface',{message:''});
    }
});

router.post('/movies_submit',upload.single('poster'),function(req,res,next) {
try{
    console.log("DATA:",req.body)
    console.log("FILE:",req.file)
    pool.query("insert into movies(stateid, cityid, cinemaid, screenid, moviename, description, status, poster) values(?,?,?,?,?,?,?,?)",[req.body.stateid, req.body.cityid,
         req.body.cinemaid, req.body.screenid, req.body.moviename, req.body.description, req.body.status, req.file.filename],function(error,result){
if(error)
{console.log("D ERROR",error)
res.render('movieinterface',{message:'Database Error'});
}
else
{
    res.render('movieinterface',{message:'Movie Information Submitted Successfully...'});
}
    })
}

catch(e)
{console.log("Error:",e)
res.render('movieinterface',{message:'Server Error'});
}
});

router.get("/fetch_state",function(req,res,next){
    try{
       
    pool.query("select * from states",function(error,result){

        if(error)
        { console.log("D ERROR",error)
            res.status(200).json([])
        }
    
        else
        {
            res.status(200).json({result:result})
        }
    })
      }
      catch(e)
      {console.log("Error:",e)
      res.render('movieinterface',{message:'Server Error'});
    
      }
   
});

router.get("/fetch_city",function(req,res,next){
    try{
       
    pool.query("select * from city where stateid=?",[req.query.typeid],function(error,result){

        if(error)
        { console.log("D ERROR",error)
            res.status(200).json([])
        }
        else
        {
            res.status(200).json({result:result})
        }
    })
      }
      catch(e)
      {console.log("Error:",e)
      res.render('movieinterface',{message:'Server Error'});
      }
});

router.get("/fetch_cinema",function(req,res,next){
    try{
       
    pool.query("select * from cinema",function(error,result){

        if(error)
        { console.log("D ERROR",error)
            res.status(200).json([])
        }
    
        else
        {
            res.status(200).json({result:result})
        }
    })
      }
      catch(e)
      {console.log("Error:",e)
      res.render('movieinterface',{message:'Server Error'});
    
      }
   
});

router.get("/fetch_screen",function(req,res,next){
    try{
       
    pool.query("select * from screen where cinemaid=?",[req.query.typeid],function(error,result){

        if(error)
        { console.log("D ERROR",error)
            res.status(200).json([])
        }
        else
        {
            res.status(200).json({result:result})
        }
    })
      }
      catch(e)
      {console.log("Error:",e)
      res.render('movieinterface',{message:'Server Error'});
      }
});

router.get("/fetch_all_movies",function(req,res,next){
try{

 var admin=JSON.parse(localStorage.getItem('ADMIN'))
            if(admin==null)
              { res.render('logininterface',{message:''});}
             

    pool.query("select M.* ,(select S.statename from states S where S.stateid=M.stateid)as statename,(select C.cityname from city C where C.cityid=M.cityid)as cityname,(select C.cinemaname from cinema C where C.cinemaid=M.cinemaid)as cinemaname,(select S.screenname from screen S where S.screenid=M.screenid)as screenname from movies M", function(error, result){
        if(error) 
        {
            console.log("D ERROR", error);
            res.render("displayallmovies",{data:[],mesage:"Database ERROR"})
        }
        else
        {
            res.render("displayallmovies",{data:result,message:"Success"})
        }
    })
}
catch(e)
{
    console.log("Error:",e)
    res.render("displayallmovies",{data:[],message:"Server ERROR"})
}
})

router.get("/editinformation",function(req,res,next){
    try{
        pool.query("select M.* ,(select S.statename from states S where S.stateid=M.stateid)as statename,(select C.cityname from city C where C.cityid=M.cityid)as cityname,(select C.cinemaname from cinema C where C.cinemaid=M.cinemaid)as cinemaname,(select S.screenname from screen S where S.screenid=M.screenid)as screenname from movies M where M.movieid=?",[req.query.movieid], function(error, result){
            if(error) 
            {
                console.log("D ERROR", error);
                res.render("editinformation",{data:[],mesage:"Database ERROR"})
            }
            else
            {
                res.render("editinformation",{data:result[0],message:"Success"})
            }
        })
    }
    catch(e)
    {
        console.log("Error:",e)
        res.render("editinformation",{data:[],message:"Server ERROR"})
    }
    })

    router.post('/edit_movies',function(req,res){
        try{
           if(req.body.btn=="Edit")
           {
            pool.query("update movies set stateid=?, cityid=?, cinemaid=?, screenid=?, moviename=?, description=?, status=? where movieid=? ",[req.body.stateid, req.body.cityid,
                 req.body.cinemaid, req.body.screenid, req.body.moviename, req.body.description, req.body.status, req.body.movieid],function(error,result){
        if(error)
        {console.log("D ERROR",error)
        res.redirect('/movies/fetch_all_movies')
        }
        else
        {
            res.redirect('/movies/fetch_all_movies')
        }
            })
        }
        else
        { pool.query("delete from movies where movieid=? ",
        [
         req.body.movieid
        ],
        function(error,result){
   if(error)
   {console.log("D ERROR",error)
   res.redirect('/movies/fetch_all_movies')
   }
   else
   {
       res.redirect('/movies/fetch_all_movies')
   }
       })

        }
       
    }catch(e)
        {console.log("Error:",e)
        res.redirect('/movies/fetch_all_movies')
        }
    })

    router.get("/editpicture",function(req,res,next){
res.render("editpicture",{data:req.query})
    })


    router.post('/edit_picture',upload.single('movieposter'),function(req,res){
        try{
          
            pool.query("update movies set poster=? where movieid=? "
            ,[
                 req.file.filename,
                 req.body.movieid
                ],
                function(error,result){
        if(error)
        {console.log("D ERROR",error)
        res.redirect('/movies/fetch_all_movies')
        }
        else
        {   fs.unlinkSync(`D:/movies_details/public/images/${req.body.oldfilename}`)
            res.redirect('/movies/fetch_all_movies')
        }
            })
        
       
       
    }catch(e)
        {console.log("Error:",e)
        res.redirect('/movies/fetch_all_movies')
        }
    })

module.exports=router