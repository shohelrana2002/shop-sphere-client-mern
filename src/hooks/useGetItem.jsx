import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setItemData } from "../redux/itemSlice";

const useGetItem = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`${serverURL}/api/item/allItems-get`, {
          withCredentials: true,
        });
        dispatch(setItemData(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchItem();
  }, [dispatch]);
};

export default useGetItem;
