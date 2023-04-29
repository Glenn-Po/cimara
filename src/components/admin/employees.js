import {
  faDownload,
  faEdit,
  faExclamationCircle,
  faEye,
  faMessage,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { usersRef } from "../../utils/firebase";
import { getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import moment from "moment";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    getDocs(usersRef)
      .then(({ docs }) => {
        setEmployees(
          docs.map((doc) => {
            return { ...doc.data(), docId: doc?.id };
          })
        );
      })
      .catch((error) => {
        toast.error("Error fetching attendance");
        console.log(error);
      });
  }, []);

  return (
    <section className="">
      <EmployeeCRU open={openDialog} setOpen={setOpenDialog} />
      <div className="px-4 py-5 text-white text-center">
        <h2 className="text-2xl text-center font-bold">All Employees</h2>
        <p className="px-3">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo
          quae porro soluta cupiditate quam natus .
        </p>
        <button
          data-modal-target="employeeModal"
          data-modal-toggle="employeeModal"
          onClick={() => setOpenDialog(true)}
          className="px-12 py-2 my-2 border-2 border-blue-500 rounded-lg hover:translate-y-1 transition-all"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add New Employee
        </button>
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
                      Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Tel
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <Employee
                      employee={employee}
                      index={index}
                      key={employee.docId}
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

const Employee = function ({ employee, index }) {
  return (
    <tr className="border-b dark:border-neutral-500">
      <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          Active
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        {employee.name || "-------"}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        {employee.role || "--------"}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        {moment(employee.startDate).format("DD-MM-YYYY") || "--------"}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        {employee.email || "-------"}
      </td>
      <td className="whitespace-nowrap px-6 py-4">{employee.telephone}</td>
      <td className="whitespace-nowrap px-6 py-4">{employee.homeAdress}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-row">
          <button className="p-1 h-8 w-8 mx-2 rounded-lg bg-slate-200 text-purple-800">
            <FontAwesomeIcon icon={faMessage} />
          </button>
          <button className="p-1 h-8 w-8 mx-2 rounded-full bg-slate-200 text-sky-300">
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button className="p-1 h-8 w-8 mx-2 rounded-full bg-slate-200 text-orange-300">
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className="p-1 h-8 w-8 mx-2 rounded-full bg-slate-200 text-red-600">
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const EmployeeCRU = function ({ open, setOpen }) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Add New Employee
                      </Dialog.Title>
                      <div className="mt-2 w-100">
                        <div className="flex justify-between">
                          <div>
                            <label
                              for="default-input"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="default-input"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                          <div>
                            <label
                              for="default-input"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Email
                            </label>
                            <input
                              type="emal"
                              id="default-input"
                              placeholder="john@example.com"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <label
                              for="default-input"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Phone
                            </label>
                            <input
                              type="text"
                              id="default-input"
                              placeholder="+237 7886836474"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                          <div>
                            <label
                              for="default-input"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              DOB
                            </label>
                            <input
                              type="date"
                              id="default-input"
                              placeholder="john@example.com"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <label
                              for="default-input"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Home Address
                            </label>
                            <input
                              type="text"
                              id="default-input"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                          <div>
                            <label
                              for="default-input"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Role
                            </label>
                            <input
                              type="emal"
                              id="default-input"
                              placeholder="john@example.com"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <label
                              for="default-input"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Priviledge
                            </label>
                            <input
                              type="text"
                              id="default-input"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                          <div>
                            <label
                              for="default-input"
                              className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                              Email
                            </label>
                            <input
                              type="emal"
                              id="default-input"
                              placeholder="john@example.com"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Add Employee
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
