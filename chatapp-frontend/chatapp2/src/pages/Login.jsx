import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
const Login = () =>{
    const navigate = useNavigate()
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const LoginUser = async() =>{

        const response = await fetch('https://chatapp-5-4d4v.onrender.com/login/',{

            method : "POST",
            headers : {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,password
            })
        })
        const data = await response.json()
        console.log(data)
        if (response.ok){
            localStorage.setItem("access",data.access)
            localStorage.setItem('refresh',data.refresh)
            localStorage.setItem('username',data.username)
            alert('user logged in successfuly')
            navigate('/')
        }else{
            alert(data.message)
            window.location.reload()
        }
    }

    return (
       <div className="min-h-screen bg-[#313338] flex justify-center items-center p-6">

  <div className="w-full max-w-md bg-[#2b2d31] rounded-2xl shadow-xl p-8">

    <h1 className="text-3xl font-bold text-center text-[#5865F2] mb-8">
      Login
    </h1>

    <div className="flex flex-col gap-4">

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full bg-[#383a40] text-white placeholder-gray-400 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#5865F2]"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full bg-[#383a40] text-white placeholder-gray-400 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#5865F2]"
      />

      <button
        onClick={LoginUser}
        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 rounded-xl transition active:scale-95"
      >
        Login
      </button>
      <Link to="/register/" className="text-center text-[#5865F2] hover:underline">
        Don't have an account? Register
      </Link>
    
  

   


    </div>

  </div>

</div>
    )
}
export default Login