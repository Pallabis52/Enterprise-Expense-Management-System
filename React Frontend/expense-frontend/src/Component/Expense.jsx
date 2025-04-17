
import React, { useEffect, useState } from "react";
import Deshboard from "./Deshboard";
import apiExpense from "../ApiHandling/AxiosExpenseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Expense() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const handleEditClick = (expense) => {
    navigate("/addexpense", { state: { editData: expense } });
  };
  useEffect(() => {
    handleApi();
  }, []);

  const handleApi = async () => {
    try {
      const response = await apiExpense.get("get");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response.status === 403) {
        toast.error("Failed to fetch data", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    }
  }

    const handleDelete = async (id) => {
      try {
        const response = await apiExpense.delete(`delete/${id}`);
        console.log(response.data);
        if (response.status === 200) {
          handleApi();
          toast.success("Expense deleted successfully!", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      } catch (error) {
        if (error.response.status === 404) {
          toast.error("Failed to delete expense", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      }
    };

    return (
      <div className="flex w-full">
        <Deshboard />
        <div className="p-6 w-full bg-gray-100">
          <h2 className="text-2xl text-center font-bold mb-4">Expense List</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border bg-white border-gray-300">
              <thead className="bg-gray-400 text-gray-800">
                <tr>
                  <th className="border border-black px-4 py-1">Id</th>
                  <th className="border border-black px-4 py-1">Title</th>
                  <th className="border border-black px-4 py-1">Amount</th>
                  <th className="border border-black px-4 py-1">Category</th>
                  <th className="border border-black px-4 py-1">Date</th>
                  <th className="border border-black px-4 py-1">Description</th>
                  <th className="border border-black px-4 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((expense) => (
                  <tr key={expense.id} className="text-center">
                    <td className="border border-gray-400 px-4 py-1">
                      {1 + data.indexOf(expense)}
                    </td>
                    <td className="border border-gray-400 px-4 py-1">
                      {expense.title}
                    </td>
                    <td className="border border-gray-400 px-4 py-1">
                      ₹{expense.amount}
                    </td>

                    <td className="border border-gray-400 px-4 py-1">
                      {expense.category}
                    </td>
                    <td className="border border-gray-400 px-4 py-1">
                      {expense.date}
                    </td>
                    <td className="border border-gray-400 px-4 py-1">
                      {expense.description}
                    </td>
                    <td className="border border-gray-400 px-4 py-1">
                      <div className=" flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditClick(expense)}
                          className="border px-4 py-1 border-gray-100 bg-gray-500 text-white rounded-xl hover:bg-gray-300 hover:text-gray-800 transition-all duration-300 "
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="border px-4 py-1 border-gray-100 bg-gray-500 text-white rounded-xl hover:bg-gray-300 hover:text-gray-800 transition-all duration-300 "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
export default Expense;
