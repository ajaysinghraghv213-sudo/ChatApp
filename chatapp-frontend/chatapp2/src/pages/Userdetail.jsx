import {useParams} from 'react-router-dom'
import {useState,useEffect} from 'react'
import {fetchRefreshToken} from '../utils/utils'

const Userdetail = () =>{
    const [user,setUser] = useState({})

    const {id} = useParams()

    useEffect(() => {
    const fetchUser = async () => {
        let access = localStorage.getItem("access");

        let response = await fetch(
            `https://chatapp-5-4d4v.onrender.com/user/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            }
        );

        if (response.status === 401) {
            await fetchRefreshToken();

            access = localStorage.getItem("access");

            response = await fetch(
                `https://chatapp-5-4d4v.onrender.com/user/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            );
        }

        const data = await response.json();

        if (response.ok) {
            setUser(data);
            console.log(data);
        } else {
            console.log("something went wrong");
        }
    };

    fetchUser();
}, [id]);
    

    return (
        <div className="min-h-screen bg-[#111b21] flex justify-center items-start pt-10">

  <div className="bg-[#202c33] w-full max-w-md rounded-lg shadow-lg overflow-hidden">

    <div className="bg-[#00a884] p-6 flex flex-col items-center">
      <img
        src={user.profile_pic}
        alt={user.username}
        className="w-32 h-32 rounded-full object-cover border-4 border-white"
      />

      <h1 className="text-white text-2xl font-semibold mt-4">
        {user.username}
      </h1>

      <p
        className={`text-sm mt-1 ${
          user.is_online ? "text-green-200" : "text-gray-300"
        }`}
      >
        {user.is_online ? "Online" : "Offline"}
      </p>
    </div>

    <div className="p-6">
      <h2 className="text-gray-400 text-sm mb-2">
        About
      </h2>

      <p className="text-white bg-[#2a3942] p-3 rounded-lg">
        {user.about || "No about information"}
      </p>
    </div>

  </div>

</div>
    )
}
export default Userdetail