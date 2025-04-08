import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AttendanceReport() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAttendance = async (from = '', to = '') => {
    try {
      setLoading(true);
      const params = {};
      if (from && to) {
        params.startDate = from;
        params.endDate = to;
      }

      const response = await axios.get("http://localhost:3001/attendance-report", { params });
      setAttendanceData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(); // Initial load without filter
  }, []);

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchAttendance(startDate, endDate);
    }
  };

  return (
    <div className="container mt-4">
      <h2>📋 Attendance Report</h2>

      {/* Filters */}
      <div className="row my-3">
        <div className="col-md-3">
          <label>From:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>To:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-3 align-self-end">
          <button className="btn btn-primary mt-2" onClick={handleFilter}>
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : attendanceData.length === 0 ? (
        <p>No attendance records found for selected dates.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={record.id}>
                <td>{index + 1}</td>
                <td>{record.id}</td>
                <td>{record.e_name}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AttendanceReport;
