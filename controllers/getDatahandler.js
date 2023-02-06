
const { MongoClient } = require("mongodb");
const uri = require('../connections/dbconnec');
const client = new MongoClient(uri);

async function getDataHandler(request,response) {
  try {
    const database = client.db("tpData");
    const randomData = database.collection("randomData");
    const responseData = await randomData.find({}).limit(30).toArray();
    const columns = Object.keys(responseData[0]).slice(1);
    response.json({
         columns:columns,
         data:responseData
    }); 
  }
  catch(error){
    response.status(400).send("Could not fetch data");
  } 
 
}



module.exports = getDataHandler;

