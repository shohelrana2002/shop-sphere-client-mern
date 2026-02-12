import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity } from "../redux/userSlice";

const useGetItemsByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data } = await axios.get(
          `${serverURL}/api/item/get-by-city/${currentCity}`,
          { withCredentials: true },
        );

        dispatch(setItemsInMyCity(data));
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShops();
  }, [currentCity, dispatch]);
};

export default useGetItemsByCity;
