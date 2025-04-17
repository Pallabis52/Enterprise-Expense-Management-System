/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import Deshboard from './Deshboard'
import { useForm } from 'react-hook-form';
import apiExpense from '../ApiHandling/AxiosExpenseConfig';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

function AddExpense() {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const location = useLocation();
  const editData = location.state?.editData || null;
  
  useEffect(() => {
    if (editData) {
      Object.entries(editData).forEach(([key, value]) => {
        if (key !== "id") {
          setValue(key, value);
        }
      });
    }
  }, [editData, setValue]);
  
 const onError = (errors) => {
   Object.values(errors).forEach((error) => {
     toast.error(error.message, {
       position: "top-center",
       autoClose: 1500,
     });
   });
 };

    const onSubmit = async (data) => {
      try {
        if (editData) {
          const response = await apiExpense.put(`/update/${editData.id}`, data);
          if (response.status === 200) {
            toast.success("Expense updated successfully!", {
              position: "top-center",
              autoClose: 1500,
            });
          }
        } else {
          const response = await apiExpense.post("/add", data);
          if (response.status === 200) {
            toast.success("Expense added successfully!", {
              position: "top-center",
              autoClose: 1500,
            });

            const addedExpense = response.data;

            if (data.receipt && data.receipt.length > 0) {
              const formData = new FormData();
              formData.append("file", data.receipt[0]);
              await apiExpense.post(`${addedExpense.id}/fileupload`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });
            }
          }
        }
      } catch (error) {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 1500,
        });
      }
      reset();
    };


    return (
      <div className="flex w-full bg-gray-100">
        <Deshboard />
        <div className="flex h-screen w-full justify-center items-center shadow-lg">
          <form onSubmit={handleSubmit(onSubmit, onError)} className="bg-white h-160 w-120 border border-gray-400 p-4">
            <h1 className="text-xl font-bold text-center">Add Expense</h1>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                {...register("title", { required: "Title is required" })}
                className="border border-gray-500 p-2 rounded w-full mb-4"
              />
            </div>

            <div>
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                {...register("amount", { required: "Amount is required" })}
                className="border border-gray-500 p-2 rounded w-full mb-4"
              />
            </div>

            <div>
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                {...register("category", { required: "Category is required" })}
                className="border border-gray-500 p-2 rounded w-full mb-4"
              >
                <option value="">Select Category</option>
                <option value="FOOD">FOOD</option>
                <option value="TRANSPORT">TRANSPORT</option>
                <option value="ENTERTAINMENT">ENTERTAINMENT</option>
                <option value="HEALTH">HEALTH</option>
                <option value="BILLS">BILLS</option>
                <option value="OTHER">OTHER</option>
                <option value="SHOPPING">SHOPPING</option>
              </select>
            </div>

            <div>
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                {...register("date", { required: "Date is required" })}
                className="border border-gray-500 p-2 rounded w-full mb-4"
              />
            </div>

            <div>
              <label htmlFor="receipt">Recipt:</label>
              <input
                type="file"
                id="receipt"
                {...register("receipt")}
                className="border border-gray-500 p-2 rounded w-full mb-4"
              />
            </div>

            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                className="border border-gray-500 p-2 rounded w-full mb-4"
              ></textarea>
            </div>
            <div className='flex gap-5 w-full justify-center'>
              <button
                className="border px-4 py-2 border-gray-100 bg-gray-500 text-white rounded-xl hover:bg-gray-300 hover:text-gray-800 transition-all duration-300 "
                type="submit"
              >
                {" "}
                Submit
              </button>
              <button
                className="border px-6 py-2 border-gray-100 bg-gray-500 text-white rounded-xl hover:bg-gray-300 hover:text-gray-800 transition-all duration-300 "
                type="reset"
              >
                {" "}
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default AddExpense