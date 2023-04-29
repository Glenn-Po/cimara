import {
  faDownload,
  faEdit,
  faEye,
  faPlus,
  faTrashAlt,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GeoPoint, addDoc, getDocs } from "firebase/firestore";
import React, { Fragment, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "react-toastify";
import { locationsRef, qrStoreRef } from "../../utils/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { getGeoPosition, getUniqueID } from "../../utils";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";

export default function Locations() {
  const [activeLocation, setActiveLocation] = useState({
    docId: null,
    name: "",
    geoLocation: null,
    code: null,
    radius: 50, //50 metres
    qrCodeURL: null,
  });

  const [locations, setLocations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    getDocs(locationsRef)
      .then(({ docs }) => {
        setLocations(
          docs.map((doc) => {
            // console.log({ ...doc.data(), docId: doc?.id });
            // console.log(doc.data());
            return { ...doc.data(), docId: doc?.id };
          })
        );
        // console.log({ ed: docs.at(0).data() });
      })
      .catch((error) => {
        toast.error("Error fetching attendance");
        console.log(error);
      });
  }, []);
  return (
    <section className="">
      <LocationCRU
        open={openDialog}
        setOpen={setOpenDialog}
        // location={activeLocation}
      />
      <div className="px-4 py-5 text-white text-center">
        <h2 className="text-2xl text-center font-bold">Working Locations</h2>
        <p className="px-3">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo
          quae porro soluta cupiditate quam natus veritatis nesciunt, quis
          aliquam blanditiis iusto ducimus suscipit?
        </p>
        <button
          onClick={() => setOpenDialog(true)}
          className="px-12 py-2 my-2 border-2 border-blue-500 rounded-lg hover:translate-y-1 transition-all"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add New Location
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
                      Town/City
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Geo Location
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Download QR Code
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location, index) => (
                    <Location
                      location={location}
                      index={index}
                      key={location.docId}
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

const Location = function ({ location, index }) {
  return (
    <tr className="border-b dark:border-neutral-500">
      <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-6 py-4">{location.name}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <Link to={"maps.google.com"}>
          {/* {location?.geoLocation &&
            new GeoPoint(
              location?.geoLocation.latitude,
              location?.geoLocation.longitude
            ).toJSON()} */}
        </Link>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-row">
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
      <td className="whitespace-nowrap px-6 py-4">
        <Link
          to={`${location?.qrCodeURL}`}
          className="p-1 h-8 w-8 mx-2 rounded-full bg-slate-200 text-green-700"
        >
          <FontAwesomeIcon icon={faDownload} />
        </Link>
      </td>
    </tr>
  );
};

const LocationCRU = function ({ open, setOpen, location }) {
  const [name, setName] = useState(location?.name || "");
  const [rad, setRad] = useState(location?.radius || 50);

  const isEdit = !!location?.docId;
  const cancelButtonRef = useRef(null);

  const createLocation = async function () {
    let newLocation = {
      name: location?.name || "",
      geoLocation: location?.geoLocation || null,
      code: location?.code || "nil",
      radius: location?.radius || 50, //50 metres
      qrCodeURL: location?.qrCodeURL || null,
    };
    newLocation.name = name;
    newLocation.radius = rad;

    if (!newLocation.name || newLocation?.radius < 5) {
      alert("Fill in all fields");
      return;
    }

    //code, location and qr

    try {
      const position = await getGeoPosition();

      newLocation.geoLocation = new GeoPoint(
        position.coords.latitude,
        position.coords.longitude
      );
    } catch (error) {
      toast.error(error.message || "Error with getting location");
      return;
    }

    const code = getUniqueID();
    newLocation.code = code;

    //construct and upload qr
    try {
      const qrRef = ref(qrStoreRef, `${code}.png`);
      const imgData = await QRCode.toDataURL(code, { level: "H" });
      const snapshot = await uploadString(qrRef, imgData, "data_url");
      const url = await getDownloadURL(qrRef);
      newLocation.qrCodeURL = url;
    } catch (error) {
      console.log(error);
      toast.error("Error: " + error.message);
      return;
    }

    console.log({ newLocation });
    // toast.success(`New Location ${newLocation?.qrCodeURL} saved!`);
    addDoc(locationsRef, newLocation)
      .then((doc) => {
        toast.success(`New Location ${newLocation.name} saved!`);
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Error Occured while saving location`);
      });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        static
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
                  <div className="sm:flex sm:items-start items-center justify-center ">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h1"
                        className="text-center text-xl font-bold leading-6 text-gray-900"
                      >
                        {isEdit
                          ? "Edit Location " + name
                          : "Add a New Location"}
                      </Dialog.Title>
                      <p className="text-red-600 text-center">
                        Make sure you are at the site. The coordinates of this
                        location will be read and used to authenticate clocking
                        frm your employees.
                      </p>
                      {/* </Dialog.Description> */}
                      <div className="mt-2 block">
                        <div>
                          <label
                            htmlFor="default-input"
                            className="block mb-2 text-sm font-medium text-gray-900 "
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="default-input"
                            placeholder="Example: Molyko, Buea"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="default-input"
                            className="block mb-2 text-sm font-medium text-gray-900 "
                          >
                            Radius in Metres
                            <p className="text-xs text-slate-600 text-light">
                              This is will represent the approximate size of the
                              premises
                            </p>
                          </label>
                          <input
                            type="number"
                            id="default-input"
                            placeholder="Exampl: 50"
                            value={rad}
                            onChange={(e) =>
                              setRad(Number.parseInt(e.target.value))
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          />
                        </div>

                        <p className="text-yellow-500 text-base my-4">
                          <FontAwesomeIcon
                            icon={faWarning}
                            className="text-yellow-300 mr-2 h-4"
                          />
                          Accept request to know your location when prompted.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      createLocation();
                      setOpen(false);
                    }}
                  >
                    {isEdit ? "Update this Location" : "Add this Location"}
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
