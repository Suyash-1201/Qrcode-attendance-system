import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Scan from './comp/Scan'
import Attendance from './comp/Attendance'
import Signup from './comp/Signup'
import Employee from './comp/Employee'
import Adminpage from './comp/Adminpage'
import Adminsignup from './comp/Adminsignup'
import Adminlogin from './comp/Adminlogin'
import Protectedroute from './comp/Protectedroute'
import Home from './comp/Home'
import Getcode from './comp/Getcode'

function App() {
  const [count, setCount] = useState(0)

  return (
    
     <Routes>
      <Route element={<Protectedroute/>}>
      
      <Route path='/attendance' element={<Attendance/>}/>
      <Route path='/emp' element={<Employee/>}/>
      <Route path='/admin' element={<Adminpage/>}/>
       <Route path='/admin-signup' element={<Adminsignup/>}/>
      <Route path='/signup' element={<Signup/>}/>
      </Route>
      {/* public routes */}
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Adminlogin/>}/>
     <Route path='/scan' element={<Scan/>}/>
     <Route path='getcode' element={<Getcode/>}/>
     </Routes>
    
  )
}

export default App
