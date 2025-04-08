import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function EmployeeRecord() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        const resp = await axios.get('http://localhost:3001/employees');
        if(resp.data){
            setRecords(resp.data);
        }        
    }
   
    return (
        <div>
            <Link to='../register-employee'>Register Employee</Link>
            <br />
            <Link to='../'>Back</Link>
            <br />
            <Link to='../attendance'>Attendance Report</Link>
            <table border={1} className="table">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Phone No.</th>
                    <th>Image Link</th>
                </tr>
                </thead>
                <tbody>
                    {records.map((emp)=>{
                        return <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.e_name}</td>
                            <td>{emp.e_phone}</td>
                            <td>{emp.image_url}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeRecord;