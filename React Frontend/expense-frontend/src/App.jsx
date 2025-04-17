import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./Component/Login"
import Register from "./Component/Register"
import Deshboard from "./Component/Deshboard"
import Home from "./Component/Home"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Expense from "./Component/Expense"
import AddExpense from "./Component/AddExpense"
import Mydashboard from "./Component/Mydashboard"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes> 
          <Route path="/" element={<Home /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={ <Register /> } />
          <Route path="/deshboard" element={ <Deshboard /> } />
          <Route path="/mydeshboard" element={ <Mydashboard/> } />
          <Route path="/expense" element={ <Expense/> } />
          <Route path="/addexpense" element={ <AddExpense /> } />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
