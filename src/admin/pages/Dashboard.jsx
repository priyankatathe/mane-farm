import React from "react";
import RecentOrders from "../components/RecentOrdersTable";
import { useGetContactQuery } from "../redux/authApi/contactApi";
import { FaPhoneAlt } from "react-icons/fa";


const Dashboard = ({ searchQuery }) => {
   const { data, isLoading } = useGetContactQuery();

  // ✅ API se total contacts
  const totalContacts = data?.enquiries?.length || 0;

  const stats = [
    {
      title: "Total Contacts",
      icon: <FaPhoneAlt />,
      iconColor: "text-[#2D461D]",
      iconBg: "bg-[#A9FF67]",
      count: isLoading ? "Loading..." : totalContacts, // ✅ dynamic count
      subtext: "Total Registered",
    },
  ];

   return (
    <div className="p-5">
      <div className="px-3 ">
        <p className="text-3xl text-[#2D461D] font-bold">Dashboard Overview</p>
        <p className="text-gray-500 text-lg md:text-xl mt-1">
          Manage and track all Equiry 
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 mt-6 px-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 bg-white shadow-md rounded-xl cursor-pointer ${
              stat.route ? "hover:shadow-lg" : ""
            }`}
            onClick={() => stat.route && navigate(stat.route)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-700">
                {stat.title}
              </h3>
              <div className={`${stat.iconBg} p-3 rounded-xl`}>
                <p className={`text-2xl ${stat.iconColor}`}>{stat.icon}</p>
              </div>
            </div>

            <p className="text-xl mt-2 text-black">{stat.count}</p>
            <div className="flex items-center gap-4 mt-2"></div>
          </div>
        ))}
      </div>

      <RecentOrders searchQuery={searchQuery} />
    </div>
  );
};


export default Dashboard;
