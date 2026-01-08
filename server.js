// include required packages
const express = require('express');
const mysql = require('mysql2/promise');
const {json} = require("express");
require('dotenv').config();
const port = 3000;

//database config info
const pool = mysql.createPool( {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
});
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
        const [rows] = await pool.execute('SELECT * FROM defaultdb.characters');
        res.json(rows);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

//Example Route: Create a new Card
app.post('/addcharacter', async (req, res) => {
    const {char_name, char_pic} = req.body;
    try{
        const [result] = await pool.execute('INSERT INTO characters(char_name, char_pic) VALUES (?,?)',[char_name, char_pic]);
        if (!char_name || !char_pic) {
            return res.status(400).json({message: "char_name and char_pic are required"});
        }
        res.status(201).json({message: 'Character'+char_name+'added successfully'});
    } catch(err){
        console.log(err);
        res.status(500).json({message: 'Server error - could not add character'+ char_name});
    }
})
//Example Route: Editing a character
app.put('/editcharacter/:id', async (req, res) => {
    const {id} = req.params;
    const {char_name, char_pic} = req.body;
    try{
        const [result] = await pool.execute('UPDATE characters SET char_name = ?, char_pic = ? WHERE id = ? ',[char_name, char_pic, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Character with id ${id} not found` });
        }
        res.json({ message: `Character ${id} updated successfully` });
    } catch (err){
        console.log(err);
        res.status(500).json({ message: 'Server error during update' });
    }
})

//Example Route: Deleting a character
app.delete('/deletecharacter/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const [result] = await pool.execute('DELETE FROM characters WHERE id = ? ',[id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Character with id ${id} not found` });
        }
        res.json({ message: `Character ${id} deleted successfully` });
    } catch (err){
        console.log(err);
        res.status(500).json({ message: 'Server error during deletion' });
    }
})



