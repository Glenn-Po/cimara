import { Route, Routes } from "react-router-dom";
import "./App.css";
import QRCodeCanvas from "./components/QRCodeCanvas";
import Landing from "./components/Landing";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import Home from "./components/admin/home";
import Locations from "./components/admin/locations";
import Employees from "./components/admin/employees";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Attendances from "./components/admin/Attendance";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="employee" element={<UserDashboard />}></Route>
        <Route path="admin">
          <Route
            index
            element={
              <AdminDashboard>
                <Home />
              </AdminDashboard>
            }
          />
          <Route
            path="employees"
            element={
              <AdminDashboard>
                <Employees />
              </AdminDashboard>
            }
          />
          <Route
            path="locations"
            element={
              <AdminDashboard>
                <Locations />
              </AdminDashboard>
            }
          />
          <Route
            path="attendance"
            element={
              <AdminDashboard>
                <Attendances />
              </AdminDashboard>
            }
          />
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: "min(100%, 512px)", marginInline: "10px" }}
        theme="light"
      />
    </>
  );
}

export default App;
