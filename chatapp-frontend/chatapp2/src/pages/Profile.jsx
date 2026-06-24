import {useEffect,useState} from 'react'
import {fetchRefreshToken} from '../utils/utils'



const Profile = () =>{
    const [user,setUser] = useState({})
    const [profileimage,setProfileImage] = useState(null)

   useEffect(() => {
    const fetchUser = async () => {
        let access = localStorage.getItem("access");

        let response = await fetch(
            "https://chatapp-5-4d4v.onrender.com/me/",
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
                "https://chatapp-5-4d4v.onrender.com/me/",
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
            console.log("error");
        }
    };

    fetchUser();
}, []);

    const updateProfile = async () => {
    const access = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("about", user.about);
      if (profileimage) {
        formData.append("profile_pic", profileimage);
    }

    const response = await fetch(
        "https://chatapp-5-4d4v.onrender.com/me/",
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${access}`
            
            },
            body:formData
        }
    );

    const data = await response.json();

    if (response.ok) {
        setUser(data);
        console.log("Profile updated");
    } else {
        console.log(data);
    }
};

    return (
      <div className="min-h-screen bg-[#313338] flex justify-center items-center p-6">

  <div className="w-full max-w-md bg-[#2b2d31] rounded-2xl shadow-xl p-6 flex flex-col items-center gap-5">

    <img
      src={user.profile_pic}
      className="w-32 h-32 rounded-full object-cover border-4 border-[#5865F2]"
      alt=""
    />

    <input
      className="w-full bg-[#383a40] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#5865F2]"
      value={user.username || ""}
      onChange={(e) =>
        setUser({
          ...user,
          username: e.target.value,
        })
      }
    />

    <input
      type="file"
      className="w-full text-gray-300 file:bg-[#5865F2] file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
      onChange={(e) => setProfileImage(e.target.files[0])}
    />

    <textarea
      className="w-full bg-[#383a40] text-white p-3 rounded-lg outline-none resize-none h-28 focus:ring-2 focus:ring-[#5865F2]"
      value={user.about || ""}
      placeholder="Tell people about yourself..."
      onChange={(e) =>
        setUser({
          ...user,
          about: e.target.value,
        })
      }
    />

    <button
      className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 rounded-xl transition active:scale-95"
      onClick={updateProfile}
    >
      Update Profile
    </button>

  </div>

</div>
    )
}
export default Profile