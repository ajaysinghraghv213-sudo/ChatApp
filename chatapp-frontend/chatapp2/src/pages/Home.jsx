import {useState,useEffect} from 'react'
import {fetchRefreshToken} from '../utils/utils'
import { Link } from 'react-router-dom';
const Home = (props) =>{
    

    useEffect(() => {
  const fetchAllUsers = async () => {
    let access = localStorage.getItem("access");

    let response = await fetch(`http://127.0.0.1:8000/users/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (response.status === 401) {
      await fetchRefreshToken();

      access = localStorage.getItem("access");

      response = await fetch("http://127.0.0.1:8000/users/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
    }

    const data = await response.json();

    if (response.ok) {
      props.setUsers(data);
      console.log(data);
    }
  };

  fetchAllUsers();
}, []);

    

   return (
  <div className="min-h-screen bg-[#313338] p-6">
  <div className="max-w-2xl mx-auto space-y-2">
    {Array.isArray(props.users) &&
      props.users.map((user) => (
        <div
          key={user.id}
          className="bg-[#2b2d31] flex justify-between items-center p-3 rounded-md hover:bg-[#3a3c43] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold">
              {user.username[0].toUpperCase()}
            </div>

            <h1 className="text-gray-200 font-medium">
              {user.username}
            </h1>
          </div>

          <Link to={`chat/${user.id}/`}>
            <button className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-3 py-1 rounded-md transition">
              Message
            </button>
          </Link>
        </div>
      ))}
  </div>
</div>
);
}
export default Home