

export const fetchRefreshToken = async() =>{
    const refresh = localStorage.getItem('refresh')

    const response = await fetch('https://chatapp-5-4d4v.onrender.com/refresh/token/',{

        method : "POST",
        headers : {
            'Content-Type':'application/json'

        },
        body:JSON.stringify({
            refresh:refresh
        })
    })
    const data = await response.json()
    if (response.ok){
        localStorage.setItem("access",data.access)
        console.log(data)
    }else{
        localStorage.clear()
        console.log("token expired")
    }
}