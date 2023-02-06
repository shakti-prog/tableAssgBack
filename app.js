const express = require('express');
const dotenv = require( 'dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');


const getDataHandler = require('./controllers/getDatahandler');
const basicSearchHandler = require('./controllers/basicSearch')
const sortHandler = require('./controllers/sortHandler');


const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());



app.get('/getData',(req,res)=>{
   getDataHandler(req,res);
})

app.post('/basicSearch',(req,res)=>{
   basicSearchHandler(req,res);
})

app.post("/sort", (req, res) => {
   sortHandler(req,res)
  
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})
  

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));