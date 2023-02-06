const { MongoClient } = require("mongodb");
const uri = require('../connections/dbconnec');
const client = new MongoClient(uri);

const sortHandler = async(request,response) => {

  try{
    const sort = request.body.sortingCondition 
    const toSearch = request.body.filteringCondition;
    Object.entries(sort).forEach((arr,index)=>(
        arr[index][1] = Number(arr[index][1])
    ))
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
    const responseData = await randomData.find(searchObject).sort(sort).limit(30).toArray();
    if(responseData.length == 0){
       response.json({
        columns:[],
        data:[]
       })
       return;
    }
    const columns = Object.keys(responseData[0]).slice(1);
    response.json({
         columns:columns,
         data:responseData
    }); 

  }
  catch(error){
    console.log(error);
    response.status(400).send("Could not fetch data");
  }  

}

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





module.exports = sortHandler;