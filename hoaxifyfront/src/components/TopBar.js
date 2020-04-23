import React from "react"
import { Link } from "react-router-dom"
import logo from '../assets/hoaxify-logo.png'
class Topbar extends React.Component{
    render(){
        return(
            <div className = "bg-white shadow-sm mb-2">
            <div className = "container">
                <nav className = "navbar navbar-light navbar-expand">
                    <Link to = "/">
                        <img src={logo} width="60" alt="hoaxify"/>Hoaxify
                    </Link>
                    <ul className = "nav navbar-nav ml-auto">
                        <li className = "nav-item">
                            <Link to = "/signup" className = "nav-link">Sing Up
                            </Link>
                        </li>
                        <li className = "nav-item">
                            <Link to = "/login" className = "nav-link">Login
                            </Link>
                        </li>
                    </ul>
                </nav>
                
            </div>
            </div>
        )
    }
}

export default Topbar;