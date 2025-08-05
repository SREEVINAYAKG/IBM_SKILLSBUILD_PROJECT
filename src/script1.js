// require('dotenv').config(); 
const express= require('express');
const path=require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const app = express();
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// app.use(express.static('assets'));
app.use(express.static(path.join(__dirname, '..', 'assets')));
app.set('views', path.join(__dirname, '..', 'views'));
const pg = require('pg');

const db = new pg.Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : false,
})
console.log("PGPASSWORD:", typeof process.env.PGPASSWORD, process.env.PGPASSWORD);
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
app.get("/donor_form/:userId",(req,res)=>{
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).send("Invalid user ID");
    }
    res.render("donor_form", { userId: userId });
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
// app.get("/donor_dashboard",(req,res)=>{
//     res.render("donor_food_data");
// })
app.get("/viewers_page", async (req, res) => {
      try {
    const foodData = await db.query("SELECT * FROM food_items");
    res.render("viewers_page", { foodItems: foodData.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/sign_up",(req,res)=>{
    res.render("signup");
})


app.post("/donor_form/:user_id",async(req,res)=>{
    res.render("donor_food_data");
})
app.get("/food_data",(req,res)=>{
    res.render("food_data");
})
app.post("/donor_dashboard/:user_id", (req, res) => {
    const { foodname, amount, address, phone_num } = req.body;
    const id = parseInt(req.params.user_id);
    const query = "INSERT INTO food_items (food_name, quantity, address, phone_num,id) VALUES ($1, $2, $3, $4,$5)";
    const values = [foodname, amount, address, phone_num, id];
    console.log("Received data:", { food_name: foodname, quantity: amount, address, phone_num, id });

    db.query(query, values)
        .then(() => {
            console.log("Food item donated:", { food_name: foodname, quantity: amount, address, phone_num, id });
            res.redirect(`/donor_dashboard/${id}`);
        })
        .catch((err) => {
            console.error("Error donating food item:", err);
            res.status(500).send("Internal Server Error");
        });
});

// app.get("/donor_dashboard/:user_id", async(req, res) => {
//     const { user_id } = req.params;
//     const userName = await db.query("SELECT username FROM users WHERE users.id = $1", [user_id]);
//     const foodDataQuery = "SELECT * FROM food_items where id = (SELECT id FROM users WHERE id = $1)";
//     await db.query(foodDataQuery, [user_id])
//         .then((result) => {
//             res.render("donor_food_data", { foodItems: result.rows, userName: userName });
//         })
//         .catch((err) => {
//             console.error("Error retrieving food data:", err);
//             res.status(500).send("Internal Server Error");
//         });
// });

app.get("/donor_dashboard/:user_id", async (req, res) => {
    const user_id = parseInt(req.params.user_id);
    if (isNaN(user_id)) return res.status(400).send("Invalid user ID");

    try {
        const foodData = await db.query("SELECT * FROM food_items WHERE id = $1", [user_id]);
        const userResult = await db.query("SELECT * FROM users WHERE id = $1", [user_id]);
        const firstName = userResult.rows[0]?.first_name || "Unknown";
        const lastName = userResult.rows[0]?.last_name || "User";
        const userName = `${firstName} ${lastName}`;

        res.render("donor_food_data", {
            foodItems: foodData.rows,
            userName: userName,
            userId: user_id
        });
    } catch (err) {
        console.error("Error retrieving dashboard data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/sign_up",(req,res)=>{
    const { fname,lname,username, password } = req.body;
    const query = "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)";
    const values = [fname, lname, username, password];
    console.log("Received signup data:", { fname,lname,username, password });
    db.query(query, values)
        .then(() => {
            console.log("User registered successfully");
            res.redirect("/donor_login");
        })
        .catch((err) => {
            console.error("Error registering user:", err);
            res.status(500).send("Internal Server Error");
        });
        // res.render("donor_food_data");
});
app.post("/donor_login",(req,res)=>{
    const { username, password } = req.body;
    console.log("Received login data:", { username, password });
    const user = "SELECT u.username, u.password,u.id FROM users u WHERE u.username = $1 AND u.password = $2";
    const values = [username, password];
    db.query(user, values)
        .then((result) => {
            if (result.rows.length > 0) {
                console.log(result.rows);
                console.log("Login successful for user:", username);
                const id = result.rows[0].id;
                console.log("User ID:", id);
                res.redirect(`/donor_dashboard/${id}`);
            } else {
                console.log(result.rows);
                console.log("Invalid username or password for user:", username);
                res.status(401).send("Invalid username or password");
            }
        })
        .catch((err) => {
            console.error("Error during login:", err);
            res.status(500).send("Internal Server Error");
        });
});


app.listen(3000,() => {
  console.log(`Server is running on http://localhost:3000`);
});

