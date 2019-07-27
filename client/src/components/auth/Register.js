import React, { Fragment,useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
const Register = () => {
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:'',
        confirm_password:'',
    });
    const {name,email,password,confirm_password} = formData
    const changeValue = e=> setFormData({...formData,[e.target.name]:e.target.value});
    const  registerUser = async e=>{
        e.preventDefault();
        if(password!=confirm_password){
            console.log('Password and confirm password does not match');
        }else{
         console.log('Success')
        }
    }
    return (
        <Fragment>
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={e=>registerUser(e)} >
            <div className="form-group">
                <input type="text" 
                 placeholder="Name"
                  onChange={e=>changeValue(e)} 
                  value={name} 
                  name="name" 
                  required />
            </div>
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
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={e=>changeValue(e)}
                     value={confirm_password}
                    name="confirm_password"
                    minLength="6"
                />
            </div>
            <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
            Already have an account? <Link to="/login">Sign In</Link>
        </p>
    </Fragment>
    ); 
}

export default Register
