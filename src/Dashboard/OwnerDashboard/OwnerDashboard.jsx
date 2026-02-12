import React from "react";
import Nav from "../../shared/Nav";
import { useSelector } from "react-redux";
import Title from "../../components/Owner/Title";
import MyShopDetails from "../../components/Owner/MyShopDetails";
import useGetMyShop from "../../hooks/useGetMyShop";
// import useGetItem from "../../hooks/useGetItem";

// const OwnerDashboard = () => {
//   useGetMyShop();
//   const { myShopData, loadingOwner } = useSelector((state) => state.owner);

//   if (loadingOwner)
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <span className="loading loading-spinner loading-lg text-orange-500"></span>
//       </div>
//     );

//   return (
//     <div className="w-full bg-orange-50">
//       <Nav />
//       {(!myShopData?.items || myShopData.items.length === 0) && <Title />}
//       {myShopData && <MyShopDetails />}
//     </div>
//   );
// };
const OwnerDashboard = () => {
  useGetMyShop();
  const { myShopData, loadingOwner } = useSelector((state) => state.owner);

  if (loadingOwner) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="w-full bg-orange-50">
      <Nav />

      {!myShopData && <Title />}

      {myShopData && <MyShopDetails />}
    </div>
  );
};

export default OwnerDashboard;

// export default OwnerDashboard;
