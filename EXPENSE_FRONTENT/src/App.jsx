import './App.css'
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import { Footer } from 'flowbite-react'; 
import Dashboard from './components/Admin/Dashboard/Dashboard';
import Manager_Dashboard from './components/Manager/Manager_Dashboard';

function App() {
  return (
    <>
       {/* <Home />  */}
      {/* <Dashboard/> */}

      <Manager_Dashboard/>
    </>
  );
}

export default App;