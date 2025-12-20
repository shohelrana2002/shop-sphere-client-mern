import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { serverURL } from "../../App";

const EditFoodItem = () => {
  const [data, setData] = useState([]);
  const { itemId } = useParams();
  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const { data } = await axios.get(
          `${serverURL}/api/item/get-item/${itemId}`
        );
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleData();
  }, [itemId]);
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default EditFoodItem;
