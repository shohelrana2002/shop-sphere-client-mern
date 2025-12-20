import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setUser, setUserLoading } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setUserLoading(true));
      try {
        const res = await axios.get(`${serverURL}/api/user/current-user`, {
          withCredentials: true,
        });

        dispatch(setUser(res.data));
      } catch (error) {
        console.log(error);
        dispatch(setUser(null)); // not logged in
      } finally {
        dispatch(setUserLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
