const express= require('express');
const path=require('path');

const app = express();
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// app.use(express.static('assets'));
app.use(express.static(path.join(__dirname, '..', 'assets')));
app.set('views', path.join(__dirname, '..', 'views'));

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
app.get("/food_data",(req,res)=>{
    res.render("food_data");
})
app.listen(3000,() => {
  console.log(`Server is running on http://localhost:3000`);
});
