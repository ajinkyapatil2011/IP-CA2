import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react'
import './App.css';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import Home from './pages/Home';
import RefrshHandler from './RefrshHandler';
import AppointmentForm from './pages/AppointmentForm';
import MyAppointments from './pages/MyAppointments';
import Outlets from './pages/Outlets';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const PrivateRoute = ({ element }) => {
  //   return isAuthenticated ? element : <Navigate to="/login" />
  // }

  return (
    <>
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/home" />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/home' element={<Home />} />
        <Route path='/outlets' element={<Outlets />} />
        <Route path='/appointment' element={<AppointmentForm/>} />
        <Route path='/myappointments' element={<MyAppointments/>} />
      </Routes>

    </>
  )
}

export default App
