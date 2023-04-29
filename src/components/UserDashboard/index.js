import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import Html5QrcodePlugin from "../QRScanner";
import { useAuth } from "../../utils/firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  GeoPoint,
  Timestamp,
  addDoc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { attendRef, auth, locationsRef } from "../../utils/firebase";
import { getGeoPosition } from "../../utils";

export default function UserDashboard() {
  const actions = { CLOCK_IN_OUT: "CLOCK_IN_OUT", REQUEST: "REQUEST" };
  const navigate = useNavigate();
  const { authUser, userIsLoading } = useAuth();
  const [time, setTime] = useState(Date.now());
  const [action, setAction] = useState(null);
  const [clockType, setClockType] = useState("CLOCK_IN");

  // const [attendance, setAttendance] = useState({
  //   employeeId: authUser?.uid,
  //   locationId: null,
  //   userLocation: null,
  //   time: new Timestamp(new Date().getSeconds, 0),
  //   type: "CLOCK_IN",
  // });

  useEffect(() => {
    if (!authUser && !userIsLoading) {
      navigate("/login");
    }
  }, []);

  const clockAction = async (locationCode) => {
    let attendance = {
      employeeId: authUser?.uid,
      locationId: null,
      userLocation: null,
      time: Timestamp.fromDate(new Date()),
      type: clockType,
    };

    try {
      const pos = await getGeoPosition();
      attendance.userLocation = new GeoPoint(
        pos.coords.latitude,
        pos.coords.longitude
      );
    } catch (error) {
      toast.error("Error getting position. Refresh page and try again");
      return;
    }

    //check if code is valid
    let locationName;

    try {
      console.log({ locationCode });
      const q = query(
        locationsRef,
        where("code", "==", locationCode),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      const location = querySnapshot.docs.at(0);
      console.log(location);
      // docs.at(0);
      // alert(querySnapshot);
      // console.log(querySnapshot);
      attendance.locationId = location.id;
      locationName = location.data().name;
    } catch (error) {
      toast.error("Error: " + error.message);
      return;
    }

    if (!attendance.userLocation || !attendance.locationId) {
      toast.error("An error occurred. Refreash and try again");
      return;
    }
    addDoc(attendRef, attendance)
      .then((_) => {
        toast.info("You have succcessfully clocked in " + locationName);
        navigate("/");
      })
      .catch((error) =>
        toast.error("There was an error. Refresh this page and try again")
      );
  };

  useEffect(() => {
    const to = setInterval(() => setTime(Date.now(), 900));
    return () => clearInterval(to);
  });
  return (
    <section className="bg-blue-600 h-screen">
      {(function () {
        switch (action) {
          case actions.CLOCK_IN_OUT:
            return (
              <div className="flex  items-center justify-around px-6 py-8 mx-auto md:h-screen lg:py-0 bg-white">
                <Html5QrcodePlugin
                  fps={10}
                  qrbox={250}
                  disableFlip={false}
                  level={"H"}
                  qrCodeSuccessCallback={
                    (result) => clockAction(result)

                    // onNewScanResult
                  }
                />
                <div className="text-center">
                  <h2 className="font-bold text-lg">Instructions</h2>
                  <ol className="text-left">
                    <li>Click on request Camera permission</li>
                    <li>Click/Tap on Allow when prompted</li>
                    <li>
                      Point your camera at the Code and make sure it is in view
                    </li>
                    <li>Hold steady till you are notified of success</li>
                    <li>Accept the prompt to get your location</li>
                    <li>ALL SET. You have been clocked in </li>
                  </ol>
                </div>
              </div>
            );
          case actions.REQUEST:
            return;
          default:
            return (
              <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a
                  href="#"
                  className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  <h1 className="text-gray-300 text-2xl font-black">CIMARA</h1>
                </a>
                <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-blue-800 border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Welcome, {auth.currentUser?.name || "Unkown"}.
                    </h1>

                    <p className="text-gray-50 text-center">
                      Complete your clocking routine
                    </p>

                    <div className="w-full px-2 text-center">
                      <p className="text-center text-gray-300">
                        {moment().format("dddd, MMMM DD yyyy")}
                      </p>

                      <h1 className="text-white font-black text-6xl ">
                        {moment().format("hh:mm:ss")}
                      </h1>
                    </div>

                    <div className="w-full flex items-center justify-around">
                      <button
                        onClick={() => {
                          setClockType("CLOCK_IN");
                          setAction(actions.CLOCK_IN_OUT);
                        }}
                        type="submit"
                        className=" text-gray-700 bg-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Clock In
                      </button>
                      <button
                        onClick={() => {
                          setClockType("CLOCK_OUT");
                          setAction(actions.CLOCK_IN_OUT);
                        }}
                        type="submit"
                        className=" text-gray-700 bg-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Clock Out
                      </button>
                      <button
                        onClick={() => setAction(actions.REQUEST)}
                        type="submit"
                        className=" text-gray-700 bg-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Request Leave
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
        }
      })()}
    </section>
  );
}
