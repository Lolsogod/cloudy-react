import React, {useContext} from "react";
import {NavLink,useNavigate } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export const Navbar = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout();
        navigate("/");
    }

    return(
        <nav>
            <h1>CloudY</h1>
            <NavLink to='/files'>Files</NavLink>
            <NavLink to='/upload'>+</NavLink>
            <a href="/Users/rayov/WebstormProjects/Cloudy/routes" onClick={logoutHandler}>Exit</a>
        </nav>
    )
}