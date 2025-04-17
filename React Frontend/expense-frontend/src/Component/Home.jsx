import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate("/login")
  }
  
  return (
    <div>
      <div
        className="bg-cover bg-center h-screen w-full flex flex-col items-center "
        style={{
          backgroundImage: `url(https://www.expenseout.com/wp-content/uploads/2022/12/Why-does-your-startup-need-an-expense-management-solution-scaled.jpg)`,
        }}
      >
        <nav className="bg-blue-400 w-full h-14 flex p-2 justify-between">
          <h1 className="text-2xl font-semibold">Expense Management</h1>
          <button
            className="bg-gray-800 text-white rounded-xl hover:border-gray-800 hover:bg-gray-400 hover:text-gray-900 px-4 border border-white"
            onClick={handleLogin}
          >
            Login
          </button>
        </nav>
        <div className="flex flex-col gap-0 justify-center h-full">
          <h1 className="text-gray-800 text-5xl font-bold mb-4">
            Welcome to Expense Management
          </h1>
          <p className="text-gray-800 text-lg mb-8">
            Manage your expenses efficiently and effectively.
          </p>
          <button
            className="bg-blue-600 text-white rounded-xl hover:border-gray-800 hover:bg-blue-400 hover:text-gray-900 px-2 py-2 border border-gray-600 w-25 ml-5"
            onClick={handleLogin}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home