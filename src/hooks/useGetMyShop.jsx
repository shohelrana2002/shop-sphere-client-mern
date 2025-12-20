import axios from "axios";
import React, { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData, setOwnerLoading } from "../redux/OwnerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMyShop = async () => {
      dispatch(setOwnerLoading(true));
      try {
        const { data } = await axios.get(`${serverURL}/api/shop/get-myShop`, {
          withCredentials: true,
        });

        dispatch(setMyShopData(data));
      } catch (error) {
        console.log(error);
        dispatch(setOwnerLoading(false));
      } finally {
        dispatch(setOwnerLoading(false));
      }
    };
    fetchMyShop();
  }, [dispatch]);
};

export default useGetMyShop;
