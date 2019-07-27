import React, { Fragment,useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
const Login = () => {
    const [formData,setFormData] = useState({
        email:'',
        password:'',
    });
    const {email,password} = formData
    const changeValue = e=> setFormData({...formData,[e.target.name]:e.target.value});
    const  loginUser = async e=>{
        e.preventDefault();
      console.log(formData)
    }
    return (
        <Fragment>
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead"><i className="fas fa-user"></i>Sign In</p>
        <form className="form" onSubmit={e=>loginUser(e)} >
         
            <div className="form-group">
                <input type="email"
                 placeholder="Email Address"
                  onChange={e=>changeValue(e)}
                   value={email} 
                   name="email" 
                />
                <small className="form-text"
                >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
                >
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    onChange={e=>changeValue(e)} 
                    value={password}
                    name="password"
                    minLength="6"
                />
            </div>
          
            <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
           Don't have an account? <Link to="/register">Register</Link>
        </p>
    </Fragment>
    ); 
}

export default Login
