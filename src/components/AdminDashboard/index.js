import {
  faArrowRightFromBracket,
  faBars,
  faCalendar,
  faGear,
  faLocation,
  faTableColumns,
  faUser,
  faUsers,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/firebase/auth";

export default function AdminDashboard({ children }) {
  const { authUser, userIsLoading } = useAuth();
  const navigate = useNavigate();
  const [showSideBar, setShowSideBar] = useState(true);
  useEffect(() => {
    if (!authUser && !userIsLoading) {
      navigate("/login");
    }
  });
  return (
    <>
      {/* Header */}
      <div className="fixed w-full flex items-center justify-between h-14 text-white z-10  bg-blue-800">
        <div className="flex items-center justify-start md:justify-center pl-3 w-14 md:w-64 h-14 bg-blue-800 border-none">
          <img
            className="w-7 h-7 md:w-10 md:h-10 mr-2 rounded-md overflow-hidden"
            src="https://therminic2018.eu/wp-content/uploads/2018/07/dummy-avatar.jpg"
          />
          <span className="hidden md:block">
            {userIsLoading && (
              <svg
                className="animate-spin h-5 w-5 mr-3 ..."
                viewBox="0 0 24 24"
              ></svg>
            )}
            {authUser?.name || "ADMIN"}
          </span>
        </div>
        <div className="flex justify-between items-center h-14 bg-blue-800 header-right">
          <div
            onClick={() => setShowSideBar((showingState) => !showingState)}
            className="cursor-pointer hover:bg-white hover:text-blue-800 rounded flex items-center w-full max-w-xl mr-4 p-2 shadow-sm border border-gray-200"
          >
            <FontAwesomeIcon icon={showSideBar ? faX : faBars} />
          </div>
          <ul className="flex items-center">
            <li>
              <Link
                to="#"
                className="flex items-center mr-4 hover:text-blue-100"
              >
                <span className="inline-flex mr-1">
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </span>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* // Sidebar */}
      <div
        className={`fixed flex flex-col top-14 ${
          showSideBar ? "left-0" : "left-[-100%]"
        }  w-14 transition-all hover:w-64 md:w-64 bg-blue-900 h-full text-white transition-all duration-300 border-none z-10 sidebar`}
      >
        <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5 hidden md:block">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-400 uppercase">
                  Main
                </div>
              </div>
            </li>
            <li>
              <Link
                to="/admin"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FontAwesomeIcon icon={faTableColumns} />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/employees"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800  text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FontAwesomeIcon icon={faUsers} />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Employees
                </span>
                {/* <span className="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-500 bg-indigo-50 rounded-full">
                New
              </span> */}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/attendance"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Attendance
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/locations"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FontAwesomeIcon icon={faLocation} />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Locations
                </span>
              </Link>
            </li>
            <li className="px-5 hidden md:block">
              <div className="flex flex-row items-center mt-5 h-8">
                <div className="text-sm font-light tracking-wide text-gray-400 uppercase">
                  Settings
                </div>
              </div>
            </li>
            <li>
              <Link
                to="#"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Profile
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <FontAwesomeIcon icon={faGear} />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Settings
                </span>
              </Link>
            </li>
          </ul>
          <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">
            Copyright @2021
          </p>
        </div>
      </div>

      <section className="fixed w-full top-14 h-full bg-slate-400">
        {/* <Html5QrcodePlugin
          fps={10}
          qrbox={250}
          disableFlip={false}
          qrCodeSuccessCallback={
            (result) => console.log(result)
            // onNewScanResult
          }
        /> */}
        {children}
      </section>
    </>
  );
}
