const {Router} = require("express");
const userMiddleware = require("../middlewares/user");
const {user,course } = require("../db/index");
const router = Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../index")

router.post('/signup' ,async function(req,res){
    const username  = req.body.username;
    const password = req.body.password;

    await user.create({
        username,
        password, 
    });
    res.json({
        msg:"user created successfully"
    });
});

router.post('/signin',async function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const userexists = await user.find({
        username,
        password
    });
    if(userexists){
        const token = jwt.sign({
            username
        },JWT_SECRET)
        res.json({
            token
        });
    } else {
        res.status(411).json({
            msg:"user dosent exists! , Please enter your username and password correctly"
        });
    }
});

router.get('/courses',async function(req,res){ //get all the courses the website is providing this doesent require any usermiddleware bcoz anyone can see all the available courses in the website
    const allCourses = await course.find({}); //this will find all the courses that is present in the course database
    res.json({
        courses : allCourses
    });
});

router.post('/courses/:courseId' , userMiddleware ,async function(req,res){ //user can purchase courses
    const courseId = req.params.courseId;
    const username = req.headers.username;

    try{
        await user.updateOne({
            username
        },{
            "$push" : {
                purchasedCourses : courseId
            }
        })
    } catch(e) {
        console.log(e);
    }
    res.json({
        msg:"purchase completed!!"
    });
})

router.get('/courses' , userMiddleware ,async function(req,res){ //to see which user has which courses purchased
    const leri = await user.findOne({
        username : req.username //we put here req.username because this is the username that is coming from the decoded jwt , we know that a middleware can transfer data from one middleware to another middleware that is what is happening here we are taking the decoded username and then we are requesting the username and obviously the username is the one that was stored in the jwt encoded
    });
    const courses = await course.find({
        _id: {
            "%in" : leri.purchasedCourses
        }
    });
    res.json({
        courses : courses
    });
});

module.exports = router;

