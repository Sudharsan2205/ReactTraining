import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { MarkEmailRead, LocalPhone, Badge, AppRegistration, AssignmentTurnedIn, Delete,Key } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import "./Table.css"
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
  
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5d3bc5",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
export default function CustomPaginationActionsTable(props) {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [DeleteStatus, SetDeleteStatus] = useState("");
  const [TaskDude, SetTaskDude] = useState({ _id: "", FullName: "", UserName: "", Email: "", PhoneNo: "", Password: "", Desigination: "", CreatedOn: "", __v: "" });
  const [TaskContent,SetTaskContent]=useState({FullName:"",TaskName:"",TaskDescription:"",uid:"",Status:""})
 
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  let Removeuser = (arg) => {
    console.log(arg,"deleteid")
    return props.deletefunc(arg);
  }
  let Assigntask = (event) => {
    SetTaskContent({...TaskContent,TaskName:"",TaskDescription:""})
    var data = (props.data.filter(a => a._id === event.target.getAttribute("data-_id")));
    SetTaskDude(data[0]);
    function PromiseFuc(){
      var mypromise = new Promise((resolve,reject)=>{
        resolve(SetTaskDude(data[0]));
     });
     return mypromise;
    }
    PromiseFuc().then(function(){
      document.querySelector(".css-11xur9t-MuiPaper-root-MuiTableContainer-root").classList.toggle("Reacttable");
      document.querySelector(".card").classList.toggle("TaskModel");
    })
    
  }
  function Taskhandler(event){
    const{name,value}=event.target
    SetTaskContent({...TaskContent,[name]:value,FullName:TaskDude.FullName,uid:TaskDude._id,Status:"Assigned"})
  }
  function TaskAssign(){
    props.AddTask(TaskContent)
    document.querySelector(".css-11xur9t-MuiPaper-root-MuiTableContainer-root").classList.toggle("Reacttable");
    document.querySelector(".card").classList.toggle("TaskModel");
  }
  var id=0;
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left"><Key />&nbsp;&nbsp;ID</StyledTableCell>
              <StyledTableCell align="left"><Badge />&nbsp;&nbsp;FullName</StyledTableCell>
              <StyledTableCell align="left"><MarkEmailRead />&nbsp;&nbsp;Email</StyledTableCell>
              <StyledTableCell align="left"><LocalPhone />&nbsp;&nbsp;PhoneNo</StyledTableCell>
              <StyledTableCell align="left"><AppRegistration />&nbsp;&nbsp;Action</StyledTableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : props.data
            ).map((row,id) => (
              <TableRow key={row._id}>
                <TableCell style={{ width: 110 }} align="left">
                  {(page*5)+(id+1)}
                </TableCell>
                <TableCell style={{ width: 140 }} align="left">
                  {row.FullName}
                </TableCell>
                <TableCell style={{ width: 120 }} align="left">
                  {row.Email}
                </TableCell>
                <TableCell style={{ width: 150 }} align="left">
                  {row.PhoneNo}
                </TableCell>
                <TableCell style={{ width: 210 }} align="left">
                  <span>
                    {/* <Button data-bs-toggle="modal" data-bs-target="#exampleModal" data-id={row._id} onClick={(event) => { SetDeleteStatus(event.target.getAttribute("data-id"))  }} sx={{ width: 95, height: 33, backgroundColor: "red",marginBottom:"3px" }} variant="contained" startIcon={<Delete />}>
                    Delete
                  </Button> */}
                  <Button data-bs-toggle="modal" data-bs-target="#exampleModal" data-id={row._id} onClick={(event)=>{Removeuser(event.target.getAttribute("data-id"))}} sx={{ width: 95, height: 33, backgroundColor: "red",marginBottom:"3px" }} variant="contained" startIcon={<Delete />}>
                    Delete
                  </Button>
                    &nbsp;&nbsp;
                    <Button sx={{ width: 140, padding: 0, height: 33, backgroundColor: "#e65100",marginBottom:"3px" }}  data-_id={row._id} onClick={Assigntask} variant="contained" startIcon={<AssignmentTurnedIn />}>
                      Assign task
                    </Button></span>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={6}
                count={props.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    {
      DeleteStatus !="" &&   <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Confirmation</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {console.log(DeleteStatus,props.data,"testting")}
            Are you want to delete <strong>{DeleteStatus!=""?props.data.find(x=>x._id==DeleteStatus)!=""?props.data.find(x=>x._id==DeleteStatus).FullName:"":""}</strong>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={Removeuser} >Ok</button>
          </div>
        </div>
      </div>
    </div>
    }
      <div className="card bg-light mb-3 TaskModel">
        <div className="card-header">Assign task</div>
        <div className="card-body" >
          <h5 className="card-title">To : {TaskDude.FullName}</h5>
          <TextField id="outlined-basic" name="TaskName" value={TaskContent.TaskName} onChange={Taskhandler} color="secondary" label="Task name" variant="outlined" sx={{ width: "-webkit-fill-available" }} /><br /><br />
          <TextField id="outlined-basic" name="TaskDescription" value={TaskContent.TaskDescription} onChange={Taskhandler} multiline color="secondary" rows={4} label="Task Description" variant="outlined" sx={{ width: "-webkit-fill-available" }} /><br /><br />
          <Button variant="contained" onClick={TaskAssign} sx={{float:"right"}} color="secondary"> Assign </Button>
          <Button variant="contained" sx={{float:"right",marginRight:"5px"}} onClick={()=>{ document.querySelector(".card").classList.toggle("TaskModel");document.querySelector(".css-11xur9t-MuiPaper-root-MuiTableContainer-root").classList.toggle("Reacttable");}} color="warning"> Cancel </Button>
        </div>
      </div>
    </>
  );
}
export function DataGridTable(props){
  const columns = [
    { field: 'FullName' ,width: 180 },
    { field: 'TaskName', width: 200 },
    { field: 'TaskDescription',headerName: 'Task Description', width:655 },
    { field: 'Status', width: 120 },
  ]; 
    return (
      <Box
        sx={{
          height: 370,
          width: '100%',
          '& .assigned': {
            justifyContent:"center",
            color: "red",
            fontSize:"medium",
            fontWeight:"bold"
          },
          '& .started': {
            justifyContent:"center",
            color: "#0dcaf0",
            fontSize:"medium",
            fontWeight:"bold"
          },
          '& .process': {
            justifyContent:"center",
            color: "orange",
            fontSize:"medium",
            fontWeight:"bold"
          },
          '& .finished': {  
            justifyContent:"center",
            color: "green",
            fontSize:"medium",
            fontWeight:"bold"
          }
        }}
      >
        <DataGrid
          rows={props.Taskdata}
          getRowId={(row)=>row._id}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick={true}
          getCellClassName={(params) => {
            if (params.field != 'Status' || params.value == null) {
              return '';
            }
            return params.value =="Assigned" ? 'assigned':params.value =="Started"?'started':params.value =="On Process"?"process": 'finished';
          }}
        />
      </Box>
    );
  
}