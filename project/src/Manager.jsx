import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import "./Manager.css"
import { AddTask, Groups, TaskAlt, NotificationsNone, DashboardCustomize, Logout, AccountCircle, Menu,ListAlt } from '@mui/icons-material';
import { Badge, Alert, AlertTitle, Stack } from '@mui/material';
import CustomPaginationActionsTable from "./Components/Table";
import {DataGridTable} from "./Components/Table";
import "./Developer.css"
let Manager_dashboard = () => {
    let [Mdata, MSetdata] = useState({ _id: "", FullName: "", UserName: "", Email: "", PhoneNo: "", Password: "", Desigination: "", CreatedOn: "", __v: "" })
    let [Resource, SetResource] = useState([]);
    let [Taskdata,SetTaskdata]=useState();
    let [NavClose,SetNavClose]=useState({TaskOrResult:false,ScreenSize:false,navcloseAt800:false})
    let navigate = useNavigate();
    let { id } = useParams();
    const secretPass = "aSA12982qHSdaa";
    useEffect(() => {

        const bytes = CryptoJS.AES.decrypt(id, secretPass);
        const data = bytes.toString(CryptoJS.enc.Utf8);
        console.log(data)
        if (data != "" && data != null) {
            axios.post("http://localhost:2000/Authenticate", { _id: data, Desigination: "Manager" }).then((res) => {
                res.data.Authorized != "Yes" ? navigate("/") : MSetdata(res.data.Data)
            })
        }
        else {
            navigate("/")
        }

    }, []);
    useEffect(() => {
        Getuser();
        GetTask();
        document.querySelector(".dashboard").classList.add("option1")
    }, [Mdata])
    function Getuser() {
        return axios.post("http://localhost:2000/GetResource", { Desigination: "Developer" }).then((response) => {
            response.data.Status === "success" && SetResource(response.data.Data)
            
        })
    }
    let GetTask=()=>{
        axios.get("http://localhost:2000/GetTasks").then((response)=>{
       response.data.statuscode===200&&SetTaskdata(response.data.Data);
        })
    }
    function Addtask(data){
        axios.post("http://localhost:2000/TaskAdd",data).then((response)=>{
            response.data.message==="success"&& GetTask();DynamicFavChange();
         
        })
    }
    function DynamicFavChange(){
        console.log("favicon")
        var link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = '/TMred.ico';
       
    }
    function DeleteUser(ID) {
        console.log(ID)
        axios.post("http://localhost:2000/DeleteUser", { id: ID }).then((data) => {
            data.data.message !== "No" ? Getuser() : alert("Something went wrong!")
            if (data.data.message !== "No") {
                Getuser()
            }
        })
    }
    window.addEventListener("resize", ()=>{
        if(window.innerWidth<1240){
            SetNavClose({...NavClose,ScreenSize:true})
        }
        else{
            SetNavClose({...NavClose,ScreenSize:false})
        }
     
    });
    return <>

        <header>
            <div className="logosec">
                <div className="logo">{Mdata.FullName}</div>
                <span onClick={() => {(!NavClose.TaskOrResult||NavClose.ScreenSize)&& document.querySelector(".navcontainer").classList.toggle("navclose") }}><Menu sx={{ fontSize: 37, color: "black",cursor: (!NavClose.TaskOrResult||NavClose.ScreenSize)?"pointer":"no-drop" }} /></span>
            </div>
            <div className="message">

                <Badge badgeContent={4} sx={{ color: "red" }}>
                    <NotificationsNone sx={{ color: "purple" }} />
                </Badge>
                <AccountCircle sx={{ color: "#4b49ac" }} />Manager Dashboard
            </div>

        </header>

        <div className="main-container">
            <div className="navcontainer" >
                <nav className="nav">
                    <div className="nav-upper-options">
                        <div className="nav-option dashboard" onClick={()=>{SetNavClose({...NavClose,TaskOrResult:false});document.querySelector(".taskresult").classList.toggle("option2"); document.querySelector(".dashboard").classList.toggle("option1")}}>
                            <DashboardCustomize />
                            <h3> Dashboard</h3>
                        </div>
                        <div className="nav-option taskresult" onClick={()=>{SetNavClose({...NavClose,TaskOrResult:true});document.querySelector(".taskresult").classList.toggle("option2"); document.querySelector(".dashboard").classList.remove("option1")}}>
                            <ListAlt />
                            <h3> Task Result</h3>
                        </div>
                        <div className="nav-option logout" onClick={() => { return navigate("/") }}>
                            <Logout />
                            <h3 >Logout</h3>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="main">
                <div className="box-container">
                    <div className="box box1">
                        <div className="text">
                            <h2 className="topic-heading">{Resource.length}</h2>
                            <h2 className="topic">Resources</h2>
                        </div>
                        <Groups sx={{ fontSize: 52, color: "white" }} />
                    </div>
                    <div className="box box2">
                        <div className="text">
                            <h2 className="topic-heading">{Taskdata!=null&&Taskdata.length}</h2>
                            <h2 className="topic">Task assigned</h2>
                        </div>
                        <AddTask sx={{ fontSize: 52, color: "white" }} />
                    </div>
                    <div className="box box3">
                        <div className="text">
                            <h2 className="topic-heading">{Taskdata!=null&&Taskdata.filter(x=>x.Status=="Finished").length}</h2>
                            <h2 className="topic">Completed task</h2>
                        </div>
                        <TaskAlt sx={{ fontSize: 52, color: "white" }} />
                    </div>
                </div>
                <div className="table-container">
                { !NavClose.TaskOrResult?(Resource != "" ? <CustomPaginationActionsTable data={Resource} deletefunc={DeleteUser} AddTask={Addtask}  /> :
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert severity="info">
                                <AlertTitle>Info</AlertTitle>
                                <strong>No Data!</strong>
                            </Alert>
                        </Stack>):
                       <DataGridTable Taskdata={Taskdata}/>
                    }
                </div>
               
            </div>
        </div>

    </>
}
export default Manager_dashboard;