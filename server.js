// include required packages
const express = require('express');
const mysql = require('mysql2/promise');
const {json} = require("express");
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};
//initialized Express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port, () =>{
    console.log('Server running on port', port);
});

//Example Route: Get all cards
app.get('/allcharacters', async (req, res) => {
    try{
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.characters');
        res.json(rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Server error for allcharacters'});
    }
});

//Example Route: Create a new Card
app.post('/addcharacters', async (req, res) => {
    const {char_name, char_pic} = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO characters(char_name, char_pic) VALUES (?,?)',[char_name, char_pic]);
        res.status(201).json({message: 'Character'+char_name+'added successfully'});
    } catch(err){
        console.log(err);
        res.status(500).json({message: 'Server error - could not add character'+ char_name});
    }
});



