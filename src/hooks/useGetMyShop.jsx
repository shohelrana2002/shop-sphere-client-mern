import axios from "axios";
import React, { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/OwnerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);
};

export default useGetMyShop;
