const express= require('express');
const path=require('path');
const app = express();
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// app.use(express.static('assets'));
app.use(express.static(path.join(__dirname, '..', 'assets')));
app.set('views', path.join(__dirname, '..', 'views'));
const pg = require('pg');



const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "ibm_skillsbuild_proj_db",
    password:"Vinayak@1234",
    port: 5433,
})

db.connect()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

    const query = "SELECT * FROM food_items";
    db.query(query)
        .then((result) => {
            console.log("Food items retrieved:", result.rows);
        })
        .catch((err) => {
            console.error("Error retrieving food items:", err);
        });

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
app.get("/food_data",(req,res)=>{
    res.render("food_data");
})
app.post("/donor_dashboard", (req, res) => {
    const { foodname, amount, address, phone_num } = req.body;

    const query = "INSERT INTO food_items (food_name, quantity, address, phone_num) VALUES ($1, $2, $3, $4)";
    const values = [foodname, amount, address, phone_num];
    console.log("Received data:", { food_name: foodname, quantity: amount, address, phone_num });

    db.query(query, values)
        .then(() => {
            console.log("Food item donated:", { food_name: foodname, quantity: amount, address, phone_num });
            res.redirect("/donor_dashboard");
        })
        .catch((err) => {
            console.error("Error donating food item:", err);
            res.status(500).send("Internal Server Error");
        });
});

const foodDataQuery = "SELECT * FROM food_items";
app.get("/donor_dashboard", (req, res) => {
    db.query(foodDataQuery)
        .then((result) => {
            res.render("donor_food_data", { foodItems: result.rows });
        })
        .catch((err) => {
            console.error("Error retrieving food data:", err);
            res.status(500).send("Internal Server Error");
        });
        res.render("donor_food_data");
});
app.listen(3000,() => {
  console.log(`Server is running on http://localhost:3000`);
});

