import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useState } from "react";
import { NotificationsNone, AccountCircle, Logout } from '@mui/icons-material';
import { Badge, Button } from '@mui/material';

let Dev_dashboard = () => {
  let [data, Setdata] = useState({ _id: "", FullName: "", UserName: "", Email: "", PhoneNo: "", Password: "", Desigination: "", CreatedOn: "", __v: "" })
  let [TaskList, SetTaskList] = useState();
  let [TaskStatus,SetTastStatus]=useState("");
  let navigate = useNavigate();
  let { id } = useParams();
  const secretPass = "aSA12982qHSdaa";

  useEffect(() => {
    var favicon= document.getElementById("favicon");
    favicon.href = "/taskPic.ico";
    const bytes = CryptoJS.AES.decrypt(id, secretPass);
    const UserUID = bytes.toString(CryptoJS.enc.Utf8);
    console.log(UserUID)
    if (UserUID !== "" && UserUID !== null) {
      axios.post("http://localhost:2000/Authenticate", { _id: UserUID, Desigination: "Developer" }).then((res) => {
        res.data.Authorized !== "Yes" ? navigate("/") : Setdata(res.data.Data)
      })
    }
    else {
      navigate("/")
    }

  }, []);
  useEffect(() => {
    if (data !== null && data !== "") {
      GetTaskData();
    }
  }, [data])
  function GetTaskData(){
    axios.post("http://localhost:2000/TaskList", { FullName: data.FullName }).then((response) => {
      response.data.status === "success" && SetTaskList(response.data.Data)
    })
  }
  function UpdateStatus(event){
    let{name,value}=event.target
    console.log(event.target.getAttribute("data-tid"),"tid")
    axios.put("http://localhost:2000/UpdateTask",{id:event.target.getAttribute("data-tid"),Status:value}).then((response)=>{
      response.data.status==200&&GetTaskData();
    })
  }
  return <>
    <div className="Top-container">
      <header>
        <div className="logosec">
          <div className="logo_dev">{data.FullName}
            <span className="LogOut_dev" onClick={() => { navigate("/") }}>
              <Logout />&nbsp;Logout
            </span>
          </div>
        </div>
        <div className="message">

          <Badge badgeContent={4} sx={{ color: "red" }}>
            <NotificationsNone sx={{ color: "purple" }} />
          </Badge>
          <AccountCircle sx={{ color: "#4b49ac" }} />Developer Dashboard
        </div>
      </header>
      <div className="MainContainer_dev">
        {
          TaskList != null &&
          TaskList.map((data, id) => {
            return <TaskNotes key={id} Task={data} ID={id} updatefunc={UpdateStatus} />
          })
        }
      </div>
    </div>

  </>
}
export default Dev_dashboard;
export function TaskNotes(props) {
  return <>
    <div className="note">
      <span><h3>{props.ID + 1}.&nbsp;&nbsp; {props.Task.TaskName}</h3></span>
      <p>{props.Task.TaskDescription}</p>
      <div className="status_btn" style={{float:"right"}}>
        <button type="button" onClick={props.updatefunc} data-tid={props.Task._id} value="Started" className="btn btn-outline-info">Started</button>&nbsp;&nbsp;
        <button type="button" onClick={props.updatefunc} data-tid={props.Task._id} value="On Process" className="btn btn-outline-warning">On Process</button>&nbsp;&nbsp;
        <button type="button" onClick={props.updatefunc} data-tid={props.Task._id} value="Finished" className="btn btn-outline-success">Finished</button>
      </div>
      <div className="status_label">
        <label style={{fontWeight:"bolder",marginTop:"8px"}}>Status : </label><span style={{color:props.Task.Status=="Finished"?"#3a996d":props.Task.Status=="Started"?"#0dcaf0":"#ffc107"}}>&nbsp;&nbsp;{props.Task.Status}</span>
      </div>
    </div>
  </>
}