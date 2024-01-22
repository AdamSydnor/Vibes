import {useSelector, useDispatch} from 'react-redux'
import {useState} from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import './LoginPage.css'

const LoginPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const page = useSelector(state =>state.page)

    //LOGIN STATE
    const [logUsername, setLogUsername] = useState('')
    const [logPassword, setLogPassword] = useState('')
    //REGISTER STATE
    const [regUsername, setRegUsername] = useState('')
    const [regPassword, setRegPassword] = useState('')

    const loginUser = async()=>{
        if (logUsername && logPassword){
            const {data} =  await axios.post('/api/auth/login',{
                username: logUsername,
                password: logPassword
            })
            if(data.success){
                dispatch({type: 'login', payload: data.user})
                dispatch({type:'page-off'})
            } else{
                alert('invalid data')
            }
            } else {
                alert('need both username and password')
            }
        }

        const registerUser = async()=>{
            if(regUsername && regPassword){
                const {data} = await axios.post ('/api/auth/register',{
                    username: regUsername,
                    password: regPassword
                })
                console.log(data)
                if(data.success){
                    dispatch({type:'login', payload: data.user})
                    dispatch({type:'page-off'})
                }else{
                    alert('invalid data')
                }
            } else{
                alert('both username and password required')
            }
        }

        return(
            <div style={{display:page}} id="page">
                <main id="forms">
                <section className = "login">
                    <h1 className = "title">Login</h1>
                    <label htmlFor = "log-username">Username</label>
                    <input type="text"
                        name = "log-username"
                        placeholder = "enter your username"
                        onChange = {(e)=> setLogUsername(e.target.value)}
                ></input>

                <label htmlFor = "log-password">Password </label>
                <input type="password"
                     name = "log-password"
                     placeholder = "enter your password"
                     onChange = {(e)=> setLogPassword(e.target.value)}
                ></input>
                <button onClick = {loginUser}>Login</button>
                </section>

                <section className = "register">
                <h1 className = "title">Register</h1>
                <input type="text"
                    name = "reg-username"
                    placeholder = "enter your username"
                    onChange = {(e)=> setRegUsername(e.target.value)}
                ></input>
                 <label htmlFor = "reg-password">Password </label>
                    <input type="password"
                    name = "reg-password"
                    placeholder = "enter your password"
                    onChange = {(e)=> setRegPassword(e.target.value)}
            ></input>
                <button onClick = {registerUser}>Register</button>

                </section>
                </main>
            </div>
        )
    }

    export default LoginPage

