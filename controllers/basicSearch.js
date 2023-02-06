const { MongoClient } = require("mongodb");
const uri = require('../connections/dbconnec');
const client = new MongoClient(uri);


const basicSearchHandler = async (request, response) => {
  try {
    const toSearch = request.body;
    const params =  Object.fromEntries(
      Object.entries(toSearch).filter((val) => val[1] != "")
    );  
    const paramArray = Object.entries(params);
    paramArray.forEach((arr,index)=>(
      paramArray[index]  = regexHandler(arr)
    ))
    const searchObject = Object.fromEntries(paramArray);
    const database = client.db("tpData");
    const randomData = database.collection("randomData");
    const responseData = await randomData.find(searchObject).toArray();
    if (responseData.length == 0) {
      response.json({
        columns: [],
        data: [],
      });
    } else {
      response.json({
        columns: Object.keys(responseData[0]).slice(1),
        data: responseData,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(404).json("Nothing to display");
  }
};


function regexHandler(paramObject)
{
    const key = paramObject[0];
    const value = paramObject[1];
    const numberRegex = /^\d+$/;
    if(numberRegex.test(value)){
      const arr = [];
      arr.push(key);
      arr.push(Number(value));
      return arr;
    }
    else{
      const arr = [];
      arr.push(key);
      arr.push({$regex: new RegExp(`${value}`,'i')})
      return arr;
      
    }
}



module.exports = basicSearchHandler;
