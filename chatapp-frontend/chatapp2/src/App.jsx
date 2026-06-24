import { Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import Navbar from "./components/Navbar"
import {useState} from 'react'
import Userdetail from "./pages/Userdetail"
import Profile from "./pages/Profile"
import PrivateRoutes from "./routes/PrivateRoutes"


const App = () =>{
   const [users,setUsers] = useState([])

  return (
    <div className=' min-h-screen bg-white dark:bg-black'>
      <Navbar setUsers={setUsers}/>
      <Routes>
        <Route path='register/' element={<Register />} />
        <Route path='login/' element={<Login />} />
        <Route path='/' element={ <PrivateRoutes><Home users={users} setUsers={setUsers}/></PrivateRoutes>} />
        <Route path='chat/:id/' element={ <PrivateRoutes><Chat /></PrivateRoutes>} />
        <Route path='user/:id/' element={ <PrivateRoutes><Userdetail /></PrivateRoutes>} />
        <Route path='profile/' element={ <PrivateRoutes><Profile /></PrivateRoutes>} />
      </Routes>
     
    </div>
  )
}
export default App