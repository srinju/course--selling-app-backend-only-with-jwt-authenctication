const {Router} = require("express");
const adminMiddleware = require("../middlewares/admin");
const {admin,course, user} = require("../db/index");
const router = Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../index")


//admin routes>>
router.post('/signup' , async function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    
    await admin.create({
        username,
        password
    })
    res.json({
        msg:"user created successfully"
    });
});

router.post('/signin', async function(req,res){
    //the username signin in with username and password and we retuen to them with a token
    const username = req.body.username;
    const password = req.body.password;

    const adminexists  = await user.find({
        username,
        password
    });
    if(adminexists){
        const token = jwt.sign({ //we sign the token with the username and the secret
            username
        },JWT_SECRET);
        res.json({ //and return the user with a token to save the jwt token in their local storage
            token
        });
    } else {
        res.status(411).json({
            msg:"wrong username and password"
        })
    } 
});

router.post('/courses',adminMiddleware , async function(req,res){ //the admin can put new  courses in the website 
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    
    const newCourse = await course.create({
        title,
        description,
        imageLink,
        price
    });
    res.json({
        msg:"course created successfully" , courseId : newCourse._id // this creates a new id to the course just created by the admin
    })
});

router.get('/courses', async function(req,res){
    const response = await course.find({});
    res.json({
        courses : response
    });
})

module.exports = router;