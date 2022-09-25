const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

let app = express();
app.use(express.json());
let db = null;

let dbPath = path.join(__dirname, "userData.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running successfully :3000");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API - INSERT VALUES INTO user TABLES
app.post("/user/", async (request, response) => {
  const { userId, name, email } = request.body;
  const postTableQuery = `INSERT INTO user (user_id,name,email)
    VALUES (
        ${userId},
        '${name}',
        '${email}');`;
  const dbResponse = await db.run(postTableQuery);
  response.send(dbResponse);
});

//API - INSERT VALUES INTO revenue TABLES
app.post("/revenue/", async (request, response) => {
  const { userId, amount, dateReceived } = request.body;
  try {
    const postRevenueQuery = `INSERT INTO revenue (user_id,amount,date_received)
    VALUES (
        ${userId},
        ${amount},
        '${dateReceived}');`;
    const dbResponse = await db.run(postRevenueQuery);
    response.send(dbResponse);
  } catch (e) {
    console.log(`Db Error ${e.message}`);
  }
});

//API - FOR SHOW USER TABLE
app.get("/", async (request, response) => {
  const userTableQuery = `SELECT * FROM user ORDER BY user_id ASC;`;
  const dbResponse = await db.all(userTableQuery);
  response.send(dbResponse.map((eachUser) => eachUser));
});

//API - FOR SHOW revenue TABLES
app.get("//", async (request, response) => {
  const revenueTableQuery = `SELECT * FROM revenue ORDER BY user_id ASC;`;
  const dbResponse = await db.all(revenueTableQuery);
  response.send(dbResponse.map((eachRevenue) => eachRevenue));
});

//API - FOR TEST RESULTS
app.get("/testresults/", async (request, response) => {
  const resultQuery = `SELECT date_received AS month,SUM(amount) AS totalAmount FROM user INNER JOIN revenue
     ON user.user_id = revenue.user_id
     GROUP BY user.user_id;`;
  const dbResponse = await db.all(resultQuery);
  response.send(dbResponse.map((eachUser) => eachUser));
});

//API - DELETE-revenue
app.delete("/revenue/:id", async (request, response) => {
  const { id } = request.params;
  const deleteTableQuery = `DELETE  FROM revenue WHERE id = ${id};`;
  const dbResponse = await db.run(deleteTableQuery);
  response.send("Delete Successfully");
});

//API - DELETE -user
app.delete("/user/:userId", async (request, response) => {
  const { userId } = request.params;
  const deleteTableQuery = `DELETE  FROM user WHERE user_id = ${userId};`;
  const dbResponse = await db.run(deleteTableQuery);
  response.send("Delete Successfully");
});
