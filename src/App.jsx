import './App.css'
import { Outlet} from "react-router-dom"
import AccountNav from './Pages/AccountNav.jsx'
import RoomHeader from './Pages/Room/RoomHeader.jsx'
import LoginPage from './Login/LoginPage.jsx'


function App() {
  return (
  <div>
    <RoomHeader/>
    <AccountNav/>
    <LoginPage/>
    <Outlet/>
  </div>
  )
}

export default App;