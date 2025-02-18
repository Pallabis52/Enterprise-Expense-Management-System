import './App.css'
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import { Footer } from 'flowbite-react'; 

function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}

export default App;