import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email:'',
        password:'',
    })
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.email === 'admin@gmail.com' &&  formData.password === 'admin'){
            alert('Login Successful');
            navigate('../employee-record')
        }else{
            alert('invalid email or password')
        }
    }


  return (
    <form onSubmit={(e)=>handleSubmit(e)}>
      <div className="mb-3">
        <label for="exampleInputEmail1" className="form-label">
          Email address
        </label>
        <input
            name="email"
          type="email"
          className="form-control"
          required
          value={formData.email}
          onChange={(e)=> handleChange(e)}
          />
      </div>
      <div className="mb-3">
        <label for="exampleInputPassword1" className="form-label">
          Password
        </label>
        <input
        name='password'
        type="password"
        value={formData.password}
        onChange={(e)=> handleChange(e)}
          className="form-control"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default AdminLogin;
