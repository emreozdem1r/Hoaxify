import React from "react"
import { Link } from "react-router-dom"
import {connect} from "react-redux"
import logo from '../assets/hoaxify-logo.png'
import ProfileImageWithDefault from './ProfileImageWithDefault';


class Topbar extends React.Component{

    state = {
        dropDownVisible: false
    }
    componentDidMount(){
        document.addEventListener('click', this.onClickTracker)
    }
    componentWillUnmount(){
        document.removeEventListener('click', this.onClickTracker)    
    }
    onClickTracker = (event) => {
        if(this.actionArea && !this.actionArea.contains(event.target)){
            this.setState({
                dropDownVisible:false
            })
        }
    }

    onClickDisplayName = () => {
        this.setState({
            dropDownVisible: true
        })
    }
    onClickMyProfile = () => {
        this.setState({
            dropDownVisible:false
        })
    }
    onClickLogout = () => {
        this.setState({
            dropDownVisible:false
        })
        const action = {
            type: 'logout-success'
        };
        this.props.dispatch(action);
    }
    assignActionArea = (area) => {
        this.actionArea = area;
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
            let dropDownClass = 'p-0 shadow dropdown-menu';
            if(this.state.dropDownVisible){
                dropDownClass+=' show'
            }
            links = (
                <ul className = "nav navbar-nav ml-auto" ref={this.assignActionArea}>
                    <li className = "nav-item dropdown">
                        <div className = "d-flex" 
                            style={{cursor: 'pointer'}} 
                            onClick={this.onClickDisplayName}
                        >
                            <ProfileImageWithDefault  image = {this.props.user.image}
                                                    className = "rounded-circle m-auto"
                                                    width = "32"
                                                    height = "32"
                                                    />
                            <span className = "dropdown-toggle">{this.props.user.displayName}</span>
                        </div>
                        
                    <div className={dropDownClass}
                         data_testid="drop-down-menu">
                        <Link to = {`/${this.props.user.username}`} 
                              className = "dropdown-item"
                              onClick={this.onClickMyProfile}
                        >
                            <i className="fas fa-user text-info"></i>My Profile
                        </Link>
                         
                        <span className="dropdown-item"
                                onClick={this.onClickLogout}
                                style={{ cursor: 'pointer'}}
                        >
                           <i className="fas fa-sign-out-alt text-danger"></i> Logout
                        </span>                    
                           
                    </div>    
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