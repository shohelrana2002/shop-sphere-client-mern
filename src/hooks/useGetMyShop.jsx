import axios from "axios";
import React, { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/OwnerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMyShop = async () => {
      try {
        const { data } = await axios.get(`${serverURL}/api/shop/get-myShop`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyShop();
  }, [dispatch]);
};

export default useGetMyShop;
