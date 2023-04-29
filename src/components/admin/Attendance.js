import React, { useEffect, useState } from "react";
import { attendRef, locationsRef, usersRef } from "../../utils/firebase";
import { getDoc, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import moment from "moment";

export default function Attendances() {
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    getDocs(attendRef)
      .then(({ docs }) => {
        setAttendances(docs.map((doc) => doc.data()));
        console.log({ docs });
        console.log({ attendances });
        // console.log(docs.at(0).data());
      })
      .catch((error) => {
        toast.error("Error fetching attendance");
        console.log(error);
      });
  }, []);
  return (
    <section className="">
      <div className="px-4 py-5 text-white text-center">
        <h2 className="text-2xl text-center font-bold">Employee Attendance</h2>
        <p className="px-3">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo
          quae porro soluta cupiditate quam natus .
        </p>
      </div>

      <div className="flex flex-col mx-8">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      #
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((attendance, index) => (
                    <AttendanceRow
                      attendance={attendance}
                      index={index}
                      key={`attend-${index}`}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const AttendanceRow = function ({ attendance, index }) {
  const [employeeName, setEmployeeName] = useState("----- -----");
  const [locationName, setLocationName] = useState("----------");
  useEffect(() => {});
  // const employeeName = 0; //(await getDoc(usersRef, attendance.employeeId)).data().name;
  // const locationName = "test";
  // (
  //   await getDoc(locationsRef, attendance.employeeId)
  // ).data().name;
  const validEntry = true;
  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-6 py-4">
        {validEntry ? (
          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            okay
          </span>
        ) : (
          <span className="bg-green-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            error
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4">{employeeName}</td>
      <td className="whitespace-nowrap px-6 py-4">{locationName}</td>
      <td className="whitespace-nowrap px-6 py-4">
        {moment(attendance.time.seconds * 1000).format("DD-MM-YYYY hh:mm")}
      </td>
      <td className="whitespace-nowrap px-6 py-4">{attendance?.type}</td>
    </tr>
  );
};
