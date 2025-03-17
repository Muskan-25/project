import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import Home from './Components/Home';
import AdminLogin from './Components/AdminLogin';
import RegisterEmployee from './Components/RegisterEmployee';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<AdminLogin />}/>
        <Route path="/employee-record" element={<RegisterEmployee />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
