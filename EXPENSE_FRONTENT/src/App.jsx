import { useState } from 'react'
import './App.css'
// import { Home } from "../Home/Home";
import { Home } from "@/Home/Home";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Home />
    </>
  )
}

export default App
