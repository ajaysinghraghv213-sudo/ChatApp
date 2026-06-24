import { Link } from "react-router-dom"
import {useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
import {fetchUsers} from '../utils/fetchUsers'
import {fetchRefreshToken} from '../utils/utils'

const Navbar = (props) =>{
    const navigate = useNavigate()
    const [users,setUsers] = useState([])
    const currentuser = localStorage.getItem('username')
   
    const [username,setUsername] = useState('')

    const LogoutUser = async()=>{
        const access = localStorage.getItem('access')
        const response = await  fetch('https://chatapp-5-4d4v.onrender.com/logout/',{
            method : "POST",
            headers :{
                'Authorization':`Bearer ${access}`
            }
        })
        const data = await response.json()
        if(response.ok){
           
            localStorage.clear()
            navigate('login/')

        }

    }
    const toggleTheme = () => {
        const isDark=
    document.documentElement.classList.toggle('dark');

    localStorage.setItem("theme",isDark?'dark':'light')}

    const handlesearch = async()=>{
        const data = await fetchUsers(username)
        props.setUsers(data)
        console.log(data)
    }
    
    
        
    

    // const selectedUser = users?.find((user)=> user.username ===currentuser)
    // const searchedUser = props.users?.find((user)=>user.username.toLowerCase()==username.toLowerCase())

    return (
       <nav className="bg-[#1e1f22] sticky top-0 z-50 shadow-md px-6 py-4 flex justify-between items-center border-b border-[#3a3c43]">

  <Link
    to="/"
    className="text-2xl font-bold text-[#5865F2]"
  >
    ChatApp
  </Link>

  <div className="flex items-center">
    <input
      className="bg-[#2b2d31] text-gray-200 border border-[#3a3c43] rounded px-3 py-1 outline-none focus:border-[#5865F2]"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Search users..."
    />

    <button
      className="ml-2 bg-[#5865F2] text-white px-3 py-1 rounded hover:bg-[#4752C4] active:scale-95 transition"
      onClick={handlesearch}
    >
      Search
    </button>
  </div>

  <div className="flex items-center gap-4">

    <Link
      to="/"
      className="text-gray-300 hover:text-white transition"
    >
      Home
    </Link>

    <Link
      to="/login"
      className="text-gray-300 hover:text-white transition"
    >
      Login
    </Link>

    <Link
      to="/register"
      className="bg-[#5865F2] text-white px-4 py-2 rounded-md hover:bg-[#4752C4] transition"
    >
      Register
    </Link>

    <button
      onClick={LogoutUser}
      className="text-gray-300 hover:text-red-400 transition"
    >
      Logout
    </button>
   <Link to='profile/'>
   <button
    
      className="text-gray-300 hover:text-yellow-300 transition"
    >
      🌙
    </button></Link>
    

  </div>

</nav>
    )
} 
export default Navbar