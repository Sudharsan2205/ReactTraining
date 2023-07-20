let cors = require("cors");
let express = require("express");
let mongoose = require("mongoose");
let config = require("./config.json")
let app = express();


//port in which node server run
app.listen(config.port,config.host,function(error){
  if(error){
    console.log("Error :",error);
  }
  else{
    console.log("Success")
  }
});
//cors
app.use(cors()).use(express.json())

//schema
let Schema = mongoose.Schema;

let User = mongoose.model("User",Schema({
  FullName : String,
  UserName  : String,
  Email:String,
  PhoneNo:String,
  Password:String,
  Desigination:String,
  CreatedOn:String
}))

let Task =mongoose.model("Task",Schema({
  FullName:String,
  TaskName:String,
  TaskDescription:String,
  Status:String,
  uid:String
}))
//connection
mongoose.set("strictQuery",true)
mongoose.connect(config.url).then(()=>{
  console.log("Connection Done");
}).catch((e)=>{
  console.log("ERROR :",e)
})


//delete
app.post("/DeleteUser",(req,res)=>{
  User.findByIdAndDelete(req.body.id).then((response)=>{
  response!=null?res.send({message:response.FullName}):res.send({message:"No"})
  });
})

 app.get("/GetUser",(request,response)=>{
  User.find((error,res)=>{
    error? console.log("Error",error):response.send(res);
    });
 });
 app.post("/InsertUser",(Insertrequest,Insertresponse)=>{
   let user = new User(Insertrequest.body)
   user.save();
   Insertresponse.send({message:"New Records are added",Status:1})
 });
 app.put("/UpdateTask",(UpdateReq,UpdateRes)=>{
  Task.findById(UpdateReq.body.id).then((DBvalue)=>{
     DBvalue.Status =UpdateReq.body.Status
     DBvalue.save().then((response)=>{
        UpdateRes.send({
          message:"updated",
          status:200
        })
     })
  })
 })

 app.post("/FindPassword",(findreq,findres)=>{
  User.find({Password:findreq.body.Password}).then((mes)=>{
    console.log(mes,"dtyh",findreq.body.Password)
    if(mes!=""){
    findres.send({message:"Already Password exists",Status:"S",Role:mes[0].Desigination,id:mes[0]._id})
    }
    else{
      findres.send({message:"no data"})
    }
  })
 })
 app.post("/Authenticate",(Req,Res)=>{
 User.find(Req.body).then((response)=>{
  if(response[0]!=null){
    console.log(response[0])
  Res.send({Data:response[0],Authorized:"Yes"});
  }
  else{
    Res.send({Authorized:"No"})
  }
 })
 })
 app.post("/FindUser",(findreq,findres)=>{
  User.find({Email:findreq.body.Email}).then((mes)=>{
    if(mes!=""){
    findres.send({Status:"Ok"})
    }
    else{
      findres.send({Status:"No"})
    }
  })
 })

app.post("/GetResource",(req,res)=>{
User.find(req.body).then((response)=>{
     response!=null?res.send({Data:response,Status:"success"}):res.send({Status:"failure"})
})
});

//task

app.post("/TaskAdd",(req,res)=>{
  console.log(req.body)
  let task = new Task(req.body)
  task.save();
  res.send({status:200,message:"success"})
})
app.get("/GetTasks",(req,res)=>{
  Task.find((error,response)=>{
    error?res.send({message:"failed",statuscode:400}):res.send({message:"success",statuscode:200,Data:response})
  })
})
app.post("/TaskList",(req,res)=>{
  Task.find(req.body).then((response)=>{
    response!=null?res.send({Data:response,status:"success"}):res.send({status:"failure"})
  })
})



