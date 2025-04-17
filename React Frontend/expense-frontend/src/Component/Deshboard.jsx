import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { GiExpense } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import { MdAddchart } from "react-icons/md";

function Deshboard() {
  const navigate = useNavigate();
  const handlelogout = () => {
    navigate("/");
    localStorage.removeItem("token");
  };
  return (
    <div className="flex bg-gray-200 h-screen">
      <nav className="flex flex-col bg-gray-700 h-screen w-[250px] p-5">
        <h1 className="text-white text-4xl font-semibold mt-6">Expense</h1>
        <h1 className="text-white text-4xl font-semibold">Dashboard</h1>

        <div className="flex flex-col h-screen my-20 gap-4">
          <Link
            className="text-white text-xl w-40 flex items-center p-2 gap-1"
            to={"/mydeshboard"}
          >
            <div>
              <IoHomeOutline />
            </div>{" "}
            MyDashboard
          </Link>

          <Link
            className="text-white text-xl w-40 flex items-center p-2 gap-1"
            to={"/expense"}
          >
            <div>
              <GiExpense />
            </div>{" "}
            Expense
          </Link>

          <Link
            className="text-white text-xl w-40 flex items-center p-2 gap-1"
            to={"/addexpense"}
          >
            <div>
              <MdAddchart />
            </div>{" "}
            Add-Expense
          </Link>

          <button
            onClick={handlelogout}
            className=" text-xl  flex items-center gap-2 text-white p-2 cursor-pointer"
          >
            {<IoIosLogOut />} LogOut
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Deshboard;
