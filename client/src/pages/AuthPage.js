import React, {useEffect, useState, useContext} from "react";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () =>{
    const auth = useContext(AuthContext)
    const {loading, error, request, clearError} = useHttp();
    const message =useMessage();
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(()=>{
        message(error);
        clearError();
    }, [error,message, clearError]);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }
    
    const registerHandler = async () => {
      try {
          const data = await request('/api/auth/register', 'POST', {...form})
          message(data.message)
      }catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        }catch (e) {}
    }
    
    return(
        <div>
            <h1>CloudY</h1>
            <label htmlFor="email"><b>Email</b></label><br/>
            <input type="email" placeholder="Enter email"
                   name="email" required onChange={changeHandler}
                   value={form.email}/><br/>
            <label htmlFor="password"><b>Password</b></label><br/>
            <input type="password" placeholder="Enter Password"
                   name="password" required onChange={changeHandler}
                   value={form.password}/><br/><br/>
            <button onClick={loginHandler} disabled={loading}>Login</button>
            <button onClick={registerHandler} disabled={loading}>Register</button>
        </div>
    )
}