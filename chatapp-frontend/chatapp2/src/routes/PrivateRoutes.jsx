import {Navigate} from 'react-router-dom'

const PrivateRoutes = ({children}) =>{
    const access = localStorage.getItem('access')
    if(access){
        return children
    }else{
        return <Navigate to='/login/'></Navigate>
    }


}
export default PrivateRoutes