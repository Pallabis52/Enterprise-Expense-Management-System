import "./App.css";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Income from "./components/Income/Income";
import Expense from "./components/Expense/Expense";
import FooterComponent from "./components/Footer/Footer";

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
