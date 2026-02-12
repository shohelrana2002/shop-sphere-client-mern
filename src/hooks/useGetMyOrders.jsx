import axios from "axios";
import React, { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

const useGetMyOrders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const { data } = await axios.get(`${serverURL}/api/orders/my-orders`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(data));
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrders();
  }, [dispatch]);
};

export default useGetMyOrders;
