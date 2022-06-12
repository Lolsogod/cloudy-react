import React, {useContext} from "react";
import {NavLink,useNavigate } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faPlus} from "@fortawesome/free-solid-svg-icons";

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
            <NavLink to='/files'>Файлы</NavLink>
            <NavLink to='/upload'><FontAwesomeIcon icon={faPlus} /></NavLink>
            <a href="/Users/rayov/WebstormProjects/Cloudy/routes" onClick={logoutHandler}> <FontAwesomeIcon icon={faArrowRightFromBracket} /></a>
        </nav>
    )
}