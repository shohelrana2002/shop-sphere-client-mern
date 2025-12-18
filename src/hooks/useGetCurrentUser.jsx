import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../App";

const useGetCurrentUser = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/user/current-user`, {
          withCredentials: true,
        });
        console.log(result?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
