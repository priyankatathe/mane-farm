import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LuBox } from "react-icons/lu";
import { GoHomeFill } from "react-icons/go";
import { RiShoppingBag3Line } from "react-icons/ri";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <GoHomeFill />, active: true },

];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const handleNavClick = () => {
    if (window.innerWidth < 768) toggleSidebar();
  };

  return (
    <>
      <div
        className={`
    fixed md:relative inset-y-0 left-0 bg-[#FFFDE1] text-black h-screen 
    p-4 shadow-xl rounded-r-2xl transform transition-transform duration-300 z-40
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 
    w-60 md:w-64
  `}
      >
        <button onClick={toggleSidebar} className="text-2xl mb-5 md:hidden">
          ✖
        </button>

        

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isDisabled = !item.active;

            return (
              <Link
                key={item.path}
                to={isDisabled ? "#" : item.path}
                onClick={
                  isDisabled ? (e) => e.preventDefault() : handleNavClick
                }
                className={`
                                    block rounded-xl py-1 transition-all duration-200
                                    ${isActive
                    ? "bg-[#417B22] text-white"
                    : "text-amber-800 hover:bg-white"
                  }
                                    ${isDisabled && "cursor-not-allowed"}
                                `}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-lg font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
