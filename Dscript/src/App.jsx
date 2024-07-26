
import './App.css'
// import SlidingMenu from './components/doctor'
import LoginComponent from './components/login';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import DoctorDash from "./components/doctor";
import AppointmentForm from './components/receptionist';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    {/* <SlidingMenu/> */}
    {/* <LoginComponent/> */}
    <Router>
      <Routes>
        <Route path="/" element={<LoginComponent/>} />
        <Route path="/doctor-dashboard" element={<DoctorDash/>} />
        <Route path="/recep-dashboard" element={<AppointmentForm/>} />
        {/* <Route path="/"  element={<h1>Hello</h1>} /> */}
      </Routes>
    </Router>
      
    </>
  )
}

export default App
