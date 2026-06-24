import {fetchRefreshToken} from '../utils/utils'


export  const fetchUsers =  async(username) =>{
        let access = localStorage.getItem('access')
        let response = await fetch(`http://127.0.0.1:8000/users/?username__icontains=${encodeURIComponent(username)}`,{

            headers : {
                "Authorization":`Bearer ${access}`

            }
        })
        if(response.status === 401){
            await fetchRefreshToken()
            access = localStorage.getItem('access')
            response = await fetch(`http://127.0.0.1:8000/users/?username__icontains=${encodeURIComponent(username)}`,{

            headers : {
                "Authorization":`Bearer ${access}`

            }
        })

    }
        const data = await response.json()
        return data
       
    }