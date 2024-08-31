import { useState } from "react";
import "./SignupForm.css";
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';

export const SignupForm = () => {

  const [values, setvalues] = useState({
    name: '',
    email:'',
    password:''
  })

  const navigate = useNavigate()
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/register', values)
    .then(res => {
      if(res.data.Status === "Success"){
        navigate('/')
      }else{
        alert("Error");
      }
    })
    .then(err => console.log(err))

  }
  return (
    <form onSubmit={handleSubmit} className="signup__form">
        <h1 className="signup__form--title">Sign Up</h1>
        <p className="signup__form--subtitle">Create your account to get started</p>

        <label htmlFor="name">Name</label>
        <input onChange={e => setvalues({...values, name: e.target.value})} type="text" name="name" placeholder="John Doe" required/>

        <label htmlFor="email">Email</label>
        <input onChange={e => setvalues({...values, email: e.target.value})} type="email" name="email" placeholder="john@example.com" required/>

        <label htmlFor="password">Password</label>
        <input onChange={e => setvalues({...values, password: e.target.value})} type="password" name="password" placeholder="*********" required/>

        <button>Sign Up</button>
        
        <p className="signup__form--text">I have an account <Link to="/">Sign In</Link></p>
    </form>
  )
}
