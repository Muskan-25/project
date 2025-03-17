import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterEmployee() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        e_name: "",
        e_phone: "",
        image: null,
    });

    const handleChange = (e) => {
        if (e.target.type === "file") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            alert("Please upload an image");
            return;
        }

        try {
            // Step 1: Upload Image to Cloudinary
            const imageData = new FormData();
            imageData.append("file", formData.image);
            imageData.append("upload_preset", "attendance-tracker-employees"); // Replace with your Cloudinary upload preset

            const cloudinaryResponse = await axios.post(
                "https://api.cloudinary.com/v1_1/dght66h2c/image/upload",
                imageData
            );

            const imageUrl = cloudinaryResponse.data.secure_url; // Cloudinary Image URL

            // Step 2: Send Employee Data to Backend
            const employeeData = {
                e_name: formData.e_name,
                e_phone: formData.e_phone,
                image_url: imageUrl,
            };

            const response = await axios.post("http://localhost:3001/register", employeeData);

            if (response.status === 200) {
                alert("Employee registered successfully!");
                navigate("/");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <form onSubmit={handleSubmit} method="post">
            <div className="mb-3">
                <label className="form-label">Employee Name</label>
                <input
                    name="e_name"
                    type="text"
                    className="form-control"
                    required
                    value={formData.e_name}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Employee Phone No.</label>
                <input
                    name="e_phone"
                    type="text"
                    className="form-control"
                    required
                    value={formData.e_phone}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Employee Image</label>
                <input
                    name="image"
                    type="file"
                    accept="image/jpeg, image/png"
                    className="form-control"
                    required
                    onChange={handleChange}
                />
            </div>

            <button type="submit" className="btn btn-primary">
                Submit
            </button>
        </form>
    );
}

export default RegisterEmployee;
