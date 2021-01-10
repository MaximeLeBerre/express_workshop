const express = require('express');
const connection = require("./config");

const port = 3000;
const app = express();

app.use(express.json());


// CONNECTING DATABASE
connection.connect(function(err) {
  if (err) {
    console.error('🔒 error connecting: ' + err.stack);
    return;
  }
  console.log('🧬 connected as id ' + connection.threadId + ' 🔓');
});


// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Welcome 🥷🏽");
});

// GET ALL WILDERS
app.get('/api/wilders', (req, res ) => {
  connection.query('SELECT * FROM wilders', (err, results) => {
    if(err){
      res.status(500).send('Error retrieving data');
      console.log(err)
    }else {
      res.status(200).json(results)
    }
  })
});

// GET ALL WILDERS NAMES
app.get('/api/wilders/name', (req, res ) => {
  connection.query('SELECT name FROM wilders', (err, results) => {
    if(err){
      res.status(500).send('Error retrieving data');
      console.log(err)
    }else {
      res.status(200).json(results)
    }
  })
});
// GET ALL WILDERS NAME BEGAN BY 'M'
app.get('/api/wilders/name/m', (req, res ) => {
  connection.query(
    'SELECT name FROM wilders WHERE name LIKE "m%"',
    [req.params.name],
    (err, results) => {
    if(err){
      res.status(500).send('Error retrieving data');
      console.log(err)
    }else {
      res.status(200).json(results)
    }
  })
});
//GET ALL WILDERS CONTAINS 'S' IN NAME
app.get('/api/wilders/name/s', (req, res ) => {
  connection.query(
    'SELECT name FROM wilders WHERE name LIKE "%s%"',
    [req.params.name],
    (err, results) => {
    if(err){
      res.status(500).send('Error retrieving data');
      console.log(err)
    }else {
      res.status(200).json(results)
    }
  })
});

// GET ALL WILDERS ASC BY DATE OF BIRTH
app.get('/api/wilders/:sort', (req, res ) => {
  connection.query(
    `SELECT * FROM wilders ORDER BY name ${req.params.sort}` , 
    [],
    (err, results) => {
    if(err){
      res.status(500).send('Error retrieving data');
      console.log(err)
    }else {
      res.status(200).json(results)
    }
  })
});
//POST A NEW WILDER
app.post('/api/wilders', (req, res) => {
  const { name, birthday, active, id } = req.body;
  connection.query('INSERT INTO wilders (name, birthday, active, id) VALUES (? ,? ,? ,?)' , 
  [name, birthday, active, id], 
  (err, results) => {
    if (err){
      console.log(err);
      res.status(500).send("Error saving a wilder");
    }else{
      res.status(200).send("Successfully saved");
    }
  }
  )
});
// PUT : MODIFY A WILDERS
app.put('/api/wilders/:id', (req, res) => {
  const wilderId = req.params.id;

  const newWilder = req.body;

  connection.query(
    'UPDATE wilders SET ? WHERE id=?',
    [newWilder, wilderId],
    (err, results) => {
      if(err){
        res.status(500).send('Oops, error, sorry bro')
      }else{
        res.status(201).send('Succesfully update')
      }
    }
  )
});

// PUT STATUS OF ACTIVE: TRUE TO ACTIVE: FALSE 
app.put('/api/wilders/active/:id', (req, res) => {
  connection.query(
    'UPDATE wilders SET active = NOT active WHERE id=?',
    [req.params.id],
    (err, results) => {
      if(err){
        console.log(err);
        res.status(500).send('error brooo')
      }else{
        res.status(200).send('Yes, congrats bro')
      }
    }
  )

});

// DELETE A WILDER

app.delete('/api/wilders/:id', (req, res) => {
  const idWilder = req.params.id; 
  connection.query(
    'DELETE FROM wilders WHERE id=?',
    [idWilder],
    (err, results) =>{
      if (err){
        res.status(500).send('NOOOOOOO')
      }else{
        res.status(200).send('You are amazing')
      }
    }
  )
});

// DELETE ALL WILDERS WHERE IS ACTIVE: FALSE
app.delete('/api/wilders', (req, res)=> {
  connection.query(
    'DELETE FROM wilders WHERE active = "False"',
    (err, results) => {
      if (err){
        console.log(err);
        res.status(500).send('YOU LOOSE BIG SHIT')
      }else{
        res.status(200).send('YEEEAH')
      }
    }
  )
})

// LISTENING 
app.listen(port, () => {
  console.log(` ⚙️.📟  Server is runing on port : ${port} ✅`);
})