/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BiShow } from "react-icons/bi";
import { GrFormViewHide } from "react-icons/gr";
import api from "../ApiHandling/AxiosConfig";

function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const handleError = (errors) => {
    if (errors.username) {
      toast.error(errors.username.message, {
        position: "top-center",
        autoClose: 1000,
      });
    }

    if (errors.password) {
      toast.error(errors.password.message, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = async (data) => {
    setIsSubmitting(true)
    console.log(data)
    try {
      const response = await api.post("signup", data);
      if (response.data.authResponse === "USER_CREATED") {
        toast.success("Register Successfully..!", {
          position: "top-center",
          autoClose: 1000,
        });
        const restoken = response.data.token;
        localStorage.setItem("token", `${restoken}`);
        navigate("/deshboard");
        console.log(response.data); 
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("USER_EXIST", {
          position: "top-center",
          autoClose: 1000,
        })
      } else if (error.response?.status === 403) {
        toast.error("Server Error")
      }
      else {
        toast.error("Something went wrong. Try again later.", {
          position: "top-center",
          autoClose: 1000,
        }),
        {
          position: "top-center",
          autoClose: 1000,
        };
      }
      console.error(error);
    }
    finally {
      setIsSubmitting(false)
      reset()
    }
  }
    return (
      <div className="h-screen flex justify-center items-center bg-gray-200">
        <form
          onSubmit={handleSubmit(onSubmit, handleError)}
          className="bg-white w-[350px] h-[450px] p-6 border border-gray-400 shadow-2xl flex flex-col gap-6 rounded-2xl"
        >
          <h1 className="text-2xl  font-bold text-center mt-1 mb-1">
            Register Here
          </h1>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 ">Name:</label>
            <input
              className="border rounded p-1  border-gray-500"
              {...register("name", { required: true })}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 ">Username:</label>
            <input
              className="border rounded p-1  border-gray-500"
              {...register("username", { required: "username is required" })}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className=" font-semibold  border border-gray-500 rounded w-full p-1 mb-1"
                {...register("password", { required: "password is required" })}
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => {
                    return setShowPassword(!showPassword);
                  }}
                  type="button"
                  className="cursor-pointer text-xl"
                >
                  {showPassword ? <BiShow /> : <GrFormViewHide />}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="border border-amber-50 bg-blue-600 text-white text-center p-2 rounded-xl hover:bg-blue-500 hover:text-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
          <div className="flex gap-1 justify-center">
            <p className="text-gray-600"> Already Have Account ? </p>
            <Link className="hover:text-blue-500 hover:underline" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    );
}
  
  export default Register;