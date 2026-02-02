const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express();
const job = require('./utils/cron')

app.use(express.json());


const MONGO_URI= process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const JWT_SECRET=process.env.JWT_SECRET;


mongoose.connect(MONGO_URI)
.then(()=>{console.log('Database Connected')})
.catch((e)=>{console.log(e)})

require('./models/UserSchema')
const User = mongoose.model("UserInfo")

job.start();
app.get('/',(req,res)=>{
    res.send({data:'vamshi'})
    console.log('vamshi')
})
app.post('/register',async(req,res)=>{
    const {name,email,password,mobile} = req.body;
    try{
        const oldUser = await User.findOne({email:email});
        if(!name || !email || !password || !mobile){
            return res.status(400).json({message:"All fields are required"})
        }
        if(oldUser){
            return res.send({data:'User already exits!!'})
        }
        const profileImage= `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
        const encryptedPassword =await bcrypt.hash(password,10);

        await User.create({
            name:name,
            email:email,
            password:encryptedPassword,
            mobile:mobile,
            Profile :profileImage,

        })
        res.send({status:'ok',data:'User Created'})
    }catch(error){
        res.send({status:'error',data:error})
    }
})

app.post('/login', async(req,res)=>{
    const {email,password} = req.body;
    console.log(req.body)
        if(!email || !password){
            return res.status(400).json({message: 'All fields are required'})
        }
        const oldUser = await User.findOne({email:email});
        if(!oldUser){
            return res.send({status:'error',data:'user doesnt exists'})
        }
        const documentId=oldUser._id;
        if(await bcrypt.compare(password,oldUser.password)){
            const token = jwt.sign({documentId},JWT_SECRET);
            console.log(token)
            if(res.status(201)){
            return res.send({status:'ok',data:{token,oldUser}})
            }else{
                return res.send({error:'error'})
            }
        }
})


require('./models/bookSchema')
const Book = mongoose.model('BookSchema');
const cloudinary = require('./utils/Cloudinary');
const protectRoute = require('./middleware/auth_middleware');

app.post('/createbook', protectRoute ,async(req,res)=>{
    const {title, caption, rating, image} = req.body; 
    try{
        if(!title || !caption || !rating || !image){
            return res.status(400).json({status:'error',message:'all feilds are required'})
        }
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;
        console.log(imageUrl)
        await Book.create({
            title:title,
            caption:caption,
            rating:rating,
            image:imageUrl,
            user:req.user._id,
        })
        res.send({status:'ok',data:"Book created successfully!!"})

    }catch(error){
        console.log(error)
        res.send({status:'error',data:error})
    }

})

//pagination 
app.get('/getbooks',protectRoute, async(req,res)=>{
    try{
        const page = req.query.page || 1;
        const limit = req.query.limit ||5;
        const skip = (page-1)*limit;

        const books = await Book.find()
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("user", "name Profile");

        const totalBooks = await Book.countDocuments();
        console.log('request reached ')
        res.send({status:'ok',data:{
            books,
            currentPage:page,
            totalBooks,
            totalPages:Math.ceil(totalBooks / limit),}
        })
    }catch(error){
         console.log("Error in getting all the books route",error);
         res.status(500).json({message:"Internal sever error"})
    }
})


app.get("/user", protectRoute, async (req, res) => {
  try {
    console.log(req);
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.send({status:'ok',data:books})
  } catch (error) {
    console.error("Get user books error:", error.message);
    res.send({ status:'error', data: "Server error" });
  }
});


app.delete("/:id",protectRoute, async(req,res)=>{
    try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // https://res.cloudinary.com/de1rm4uto/image/upload/v1741568358/qyup61vejflxxw8igvi0.png
    // delete image from cloduinary as well
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(PORT,()=>{
    console.log(`Sever is running on the port ${PORT}`)
})