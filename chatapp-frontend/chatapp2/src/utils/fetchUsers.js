import {fetchRefreshToken} from '../utils/utils'


export  const fetchUsers =  async(username) =>{
        let access = localStorage.getItem('access')
        let response = await fetch(`https://chatapp-5-4d4v.onrender.com/users/?username__icontains=${encodeURIComponent(username)}`,{

            headers : {
                "Authorization":`Bearer ${access}`

            }
        })
        if(response.status === 401){
            await fetchRefreshToken()
            access = localStorage.getItem('access')
            response = await fetch(`https://chatapp-5-4d4v.onrender.com/users/?username__icontains=${encodeURIComponent(username)}`,{

            headers : {
                "Authorization":`Bearer ${access}`

            }
        })

    }
        const data = await response.json()
        return data
       
    }