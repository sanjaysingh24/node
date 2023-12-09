import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';
import 'dotenv/config';
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});
const user = new mongoose.model("Userinfo",userSchema);
app.get('/', (req, res) => {
    res.render("home.ejs");
})

app.get('/login', (req, res) => {
    res.render("login.ejs");
})

app.get('/register', (req, res) => {
    res.render("register.ejs");
})

app.post("/register",async (req, res) => {
    const newuser = new user({
        email: req.body.email,
        password: req.body.password
    })
   const x =  await newuser.save();
   if(x){
    res.render('login.ejs');
   }
   else{
    console.log("something went wrong");
   }

});

app.post("/login",async(req,res)=>{
   const email = req.body.email;
   const password = req.body.password;
 try{
   const check = await user.findOne({email:email});
   if(check.password ===password){
    res.render("secret.ejs",{error:""});
   }
   else{
    res.render("login.ejs",{error:"fill the right credential"});
   }
 }catch(err){
 res.send("wrong details")
 console.log(err);
}
})































app.listen(port,()=>{
    console.log(`listening on ${port}`);
})