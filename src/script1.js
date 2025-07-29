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
app.listen(3000);
