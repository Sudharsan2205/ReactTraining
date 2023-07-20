import React, { Suspense, lazy } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import ErrorPage from "./ERROR";
import Manager_dashboard from "./Manager";
import Dev_dashboard from "./Developer";
function App() {
  return (
    <Router>
         <Routes>
         <Route exact path='/' element={< Login />}></Route>
         <Route exact path='/Register' element={< Register />}></Route>
         <Route exact path='/Developer/:id' element={< Dev_dashboard />}></Route>
         <Route exact path='/Manager/:id' element={< Manager_dashboard />}></Route>
         <Route  path='*' element={<ErrorPage/>}></Route>
         </Routes>
    </Router>
  );
}

export default App;
