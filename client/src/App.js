import React from "react";

import './App.css';
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {BrowserRouter as Router} from "react-router-dom"
import {AuthContext} from "./context/AuthContext";
import {Navbar} from "./components/Navbar";
import {Loader} from "./components/Loader";

function App() {

    const {login, logout, userId, token, ready} = useAuth()
    const isAuthenticated  = !!token;
    const routes = useRoutes(isAuthenticated, token);

    if(!ready){
        return <Loader/>
    }
  return (
    <AuthContext.Provider value={{token, login, logout, userId}}>
      <Router>
        <div className="container">
            {isAuthenticated && <Navbar/>}
            {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
