import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";

const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data } = await axios.get(
          `${serverURL}/api/shop/get-By-city/${currentCity}`,
          { withCredentials: true }
        );

        dispatch(setShopsInMyCity(data));
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShops();
  }, [currentCity, dispatch]);
};

export default useGetShopByCity;
