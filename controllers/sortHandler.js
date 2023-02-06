const { MongoClient } = require("mongodb");
const uri = require('../connections/dbconnec');
const client = new MongoClient(uri);

const sortHandler = async(request,response) => {

  try{
    const sort = request.body;
    Object.entries(sort).forEach((arr,index)=>(
        arr[index][1] = Number(arr[index][1])
    ))
    const database = client.db("tpData");
    const randomData = database.collection("randomData");
    const responseData = await randomData.find({}).sort(sort).limit(30).toArray();
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

module.exports = sortHandler;