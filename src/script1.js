const express= require('express');
const path=require('path');

const app = express();
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('assets'));

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/donor_form",(req,res)=>{
    res.render("donor_form");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/about",(req,res)=>{
    res.render("about");
})
app.get("/donor_login",(req,res)=>{
    res.render("donor_login");
})
app.get("/donor_food_data",(req,res)=>{
    res.render("donor_food_data");
})
app.get("/viewers_page",(req,res)=>{
    res.render("viewers_page");
})
app.get("/signup",(req,res)=>{
    res.render("signup");
})
app.post("/donor_login",(req,res)=>{
    res.render("donor_food_data");
})
app.post("/signup",(req,res)=>{
    res.render("donor_food_data");
})
app.post("/donor_form",async(req,res)=>{
    res.render("donor_food_data");
})
app.listen(3000);
