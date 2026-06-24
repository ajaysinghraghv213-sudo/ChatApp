import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Register = () =>{
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()
    const RegisterUser = async() =>{

        const response = await fetch('https://chatapp-5-4d4v.onrender.com/register/',{

            method : 'POST',
            headers : {
                "Content-Type":'application/json'
            },
            body:JSON.stringify({
                username,
                email,
                password
            })
        })
        const data = await response.json()
        if (response.ok){
            alert('user created succesfully')
            navigate('/login/')

        }else{
            alert('something went wrong!')
        }
    }

    return (
        <div className="min-h-screen bg-[#313338] flex justify-center items-center p-6">

  <div className="w-full max-w-md bg-[#2b2d31] rounded-2xl shadow-xl p-8">

    <h1 className="text-3xl font-bold text-center text-[#5865F2] mb-8">
      Register
    </h1>

    <div className="flex flex-col gap-4">

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full bg-[#383a40] text-white placeholder-gray-400 p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#5865F2]"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
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
        onClick={RegisterUser}
        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 rounded-xl transition active:scale-95"
      >
        Register
      </button>

    </div>

  </div>

</div>
    )
}
export default Register