
"use client";

import { Button, Card, Footer } from "flowbite-react";
import Header from "../Header/Header";
import Dashboard from "../Admin/Dashboard/Dashboard";
import FooterComponent from "../Footer/Footer";



export default function Home() {
  return (
   <>
     <Header />
        <Dashboard/>
        <FooterComponent />
   </>
  );
}

