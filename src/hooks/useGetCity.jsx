import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEO_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      console.error("Geo API key missing");
      return;
    }

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const { data } = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse`,
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
                apiKey,
              },
            }
          );

          const city = data?.results?.[0]?.city;
          const state = data?.results?.[0]?.state;
          const address =
            data?.results?.[0]?.address_line2 ||
            data?.results?.[0]?.address_line1;

          if (state) {
            dispatch(setCurrentState(state));
          }
          if (city) {
            dispatch(setCurrentCity(city));
          }
          if (address) {
            dispatch(setCurrentAddress(address));
          }
        } catch (error) {
          console.error(" Failed to fetch city", error);
        }
      },
      (error) => {
        console.error(" Location permission denied", error.message);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);
};

export default useGetCity;
