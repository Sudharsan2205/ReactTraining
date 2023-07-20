import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack,VisibilityOff,Visibility } from '@mui/icons-material';
import axios from "axios";
import $ from 'jquery';
import "./Register.css"

function Register(){
  let createdTime = new Date().toLocaleTimeString();
    let[FormValue,SetFormValue]= useState({FullName:"",UserName:"",Email:"",PhoneNo:"",Password:"",Desigination:"",CreatedOn:""})
    let [CpassVisible,SetCpassVisible] = useState(false)
    let navigate = useNavigate();
    $('input[name=Desigination]').on('change',function(){
      var value = $( 'input[name=Desigination]:checked' ).val();
      if(value!=null){
        SetFormValue(()=>{
          return{
            ...FormValue,
            Desigination:value
          }
        },)
      }
      });
    function EventHandler(event){
      
      const{name,value}=event.target;
        SetFormValue({...FormValue,[name]:value})
    }
    function PasswordChange(event){
      var password=document.getElementById("Pass").value;
      const{name,value}=event.target;
      console.log(password,value)
      if(password===value)
      {
        SetFormValue(()=>{return{...FormValue,Password:value,CreatedOn:createdTime}})
        document.querySelector("#passwordDiv").classList.remove("cpassword_error")
      }  
      else{       
        document.querySelector("#passwordDiv").classList.add("cpassword_error")
      }
    
    }
    function FormSubmit(event){
      event.preventDefault();
      if(FormValue.Password!=""){
        CheckPassowrd();
      }
      }
        
      
      let CheckPassowrd=()=>{
        axios.post("http://localhost:2000/FindPassword",FormValue).then((msg)=>{
          msg.data.Status=="S"? alert(msg.data.message):InsertMethod();
        })
      }
    let InsertMethod=()=>{
      axios.post('http://localhost:2000/InsertUser',FormValue).then((res)=>{
        res.data.Status==1?navigate("/"):alert("Failed");
       })
    }
    return <>
    
    <div className="RegisterMainContainer">
      <div className="registercontainer">
        <div className="title">Registration
         <div className="Logout_Register" onClick={()=>navigate("/")} style={{cursor:"pointer"}}><ArrowBack/> Back</div>
     </div>
    <div className="content">
      <form action="#" onSubmit={FormSubmit}>
        <div className="user-details">
          <div className="input-box">
            <span className="details">Full Name</span>
            <input type="text" placeholder="Enter your name" onChange={EventHandler}name="FullName" required />
          </div>
          <div className="input-box">
            <span className="details">Username</span>
            <input type="text" placeholder="Enter your username" onChange={EventHandler}name="UserName" required />
          </div>
          <div className="input-box">
            <span className="details">Email</span>
            <input type="text" placeholder="Enter your email" onInput={(e)=>{e.target.value=e.target.value.toLowerCase()}} onChange={EventHandler} name="Email" required />
          </div>
          <div className="input-box">
            <span className="details">Phone Number</span>
            <input type="text" maxLength={12} placeholder="Enter your number" onChange={EventHandler}name="PhoneNo" required />
          </div>
          <div className="input-box">
            <span className="details">Password</span>
            <input type="text" placeholder="Enter your password" id="Pass" name="Password" required />
          </div>
          <div className="input-box">
            <span className="details">Confirm Password</span>
            <div id="passwordDiv">
             <input type={CpassVisible?"text":"password"} onChange={PasswordChange} placeholder="Confirm your password" id="Cpass" className="Cpassword" name="CPassword" required />{CpassVisible?<Visibility sx={{fontSize:15}} onClick={()=>{SetCpassVisible(false)}}/>:<VisibilityOff  sx={{fontSize:15}} onClick={()=>{SetCpassVisible(true)}}/>}
             </div>
          </div>
        </div>
        <div className="gender-details">
          <input type="radio"  value="Manager" name="Desigination" id="dot-1" required/>
          <input type="radio"  value="Developer" name="Desigination" id="dot-2" required/>
          <span className="gender-title">Desigination</span>
          <div className="category">
            <label htmlFor="dot-1">
            <span className="dot one"></span>
            <span className="role" name = "Desigination">Manager</span>
          </label>
          <label htmlFor="dot-2">
            <span className="dot two"></span>
            <span className="role" name="Desigination">Developer</span>
          </label>
          </div>
        </div>
        <div className="button">
          <input  type="submit" value="Register"/>
        </div>
      </form>
    </div>
  </div>
    </div>
    </>
}
export default Register;