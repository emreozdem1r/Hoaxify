import React from "react"
import { Link } from "react-router-dom"
import {connect} from "react-redux"
import logo from '../assets/hoaxify-logo.png'
class Topbar extends React.Component{

    onClickLogout = () => {
        const action = {
            type: 'logout-success'
        };
        this.props.dispatch(action);
    }
    render(){
        let links = (
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
        );
        if(this.props.user.isLoggedIn){
            links = (
                <ul className = "nav navbar-nav ml-auto">
                    <li className = "nav-item nav-link"
                     onClick = {this.onClickLogout}
                     style = {{ cursor: 'pointer'}}>Logout</li>                    
                    <li className = "nav-item">
                        <Link to = {`/${this.props.user.username}`} className = "nav-link">My Profile
                        </Link>
                    </li>
                </ul>
            )
        }
        return(
            <div className = "bg-white shadow-sm mb-2">
            <div className = "container">
                <nav className = "navbar navbar-light navbar-expand">
                    <Link to = "/">
                        <img src={logo} width="60" alt="hoaxify"/>Hoaxify
                    </Link>
                    {links}
                </nav>
                
            </div>
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    return {
        user:state
    }
}

export default connect(mapStateToProps)(Topbar);