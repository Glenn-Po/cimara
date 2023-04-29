import { v4 as uuidv4, v5 as uuidv5 } from "uuid";

const getUniqueID = () => uuidv5(uuidv4(), uuidv5.DNS);
const getGeoPosition = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
export { getUniqueID, getGeoPosition };
