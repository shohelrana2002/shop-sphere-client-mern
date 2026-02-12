import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { serverURL } from "../App";

const useUpdateLocation = () => {
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      await axios.post(
        `${serverURL}/api/user/update-location`,
        { lat, lon },
        { withCredentials: true },
      );
    };
    navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    });
  }, [userData]);
};

export default useUpdateLocation;
