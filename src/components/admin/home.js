import { faLocation, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Timestamp,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { attendRef, locationsRef, usersRef } from "../../utils/firebase";
import { toast } from "react-toastify";
import moment from "moment";

export default function Home() {
  const navigate = useNavigate();
  const { authUser, userIsLoading } = useAuth();
  const [locationCount, setLocationCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [presentTodayCount, setPresentTodayCount] = useState(0);
  const [absentTodayCount, setAbsentTodayCount] = useState(0);

  useEffect(() => {
    const q = query(usersRef, where("priviledge", "==", "EMPLOYEE"));

    // const q2 = query(
    //   attendRef,
    //   where("time", ">=", new Timestamp(new Date().getMilliseconds, 0))
    // );
    // //present if your id shows up in todays attendance

    // getCountFromServer(q2)
    //   .then((snap) => setEmployeeCount(snap.data().count))
    //   .catch((e) => toast.error("Error fetching emloyers: " + e?.message));

    getCountFromServer(q)
      .then((snap) => setEmployeeCount(snap.data().count))
      .catch((e) => toast.error("Error fetching emloyers: " + e?.message));

    getCountFromServer(locationsRef)
      .then((snap) => setLocationCount(snap.data().count))
      .catch((e) => toast.error("Error fetching locations: " + e?.message));
  });

  useEffect(() => {
    if (!authUser && !userIsLoading) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {userIsLoading ? (
        <div class=" fixed h-full w-full z-90">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="flex flex-col justify-around w-[90%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="stroke-current h-6 text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
                />
              </div>
              <div className="text-right">
                <p className="text-2xl">{employeeCount}</p>
                <p>Employees</p>
              </div>
            </div>
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <FontAwesomeIcon
                  icon={faLocation}
                  className="stroke-current h-6 text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
                />
              </div>
              <div className="text-right">
                <p className="text-2xl">{locationCount}</p>
                <p>Locations</p>
              </div>
            </div>
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <svg
                  width="30"
                  height="30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  ></path>
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl">003</p>
                <p>Present Today</p>
              </div>
            </div>
            <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <svg
                  width="30"
                  height="30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl">001</p>
                <p>Absent</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
