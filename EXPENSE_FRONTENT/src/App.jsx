import "./App.css";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Contact from "./components/Contact/Contact";
import Expense from "./components/Expense/Expense";
import FooterComponent from "./components/Footer/Footer";
import Register from "./components/Regpage/Reg";
import Login from "./components/Regpage/login";
import Income from "./components/Income/Income";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/income",
      element: <Income />,
    },
    {
      path: "/expense",
      element: <Expense />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path:"/register",
      element:<Register />
    },
    {
      path:"/login",
      element:<Login/>
    }
  ]);

  return (
    <>
      <Header />
      <RouterProvider router={router} />
      <FooterComponent/>
    </>
  );
}

export default App;