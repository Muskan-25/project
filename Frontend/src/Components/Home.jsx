import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
    <Link to='login'><button className="btn btn-info">Login As Admin</button></Link>
    <button className="btn btn-warning">Mark Attendance</button>
    </>
  )
}

export default Home