import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as faceapi from "face-api.js";

function RegisterEmployee() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        e_name: "",
        e_phone: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                
                await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
                await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
                await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
                await faceapi.nets.ssdMobilenetv1.loadFromUri(window.location.origin + "/models");
                
                console.log("FaceAPI models loaded successfully!");
            } catch (error) {
                console.error("Error loading models:", error);
            }
        };
        loadModels();
    }, []);

    const handleChange = (e) => {
        if (e.target.type === "file") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const extractFaceEmbedding = async (imageFile) => {
        return new Promise((resolve, reject) => {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(imageFile);
            img.crossOrigin = "anonymous"; // Fix CORS issue
            img.onload = async () => {
                try {
                    const detections = await faceapi
                        .detectSingleFace(img, new faceapi.SsdMobilenetv1Options()) // More accurate model
                        .withFaceLandmarks()
                        .withFaceDescriptor();
    
                    if (!detections) {
                        reject("No face detected! Try another image.");
                    } else {
                        resolve(Array.from(detections.descriptor));
                    }
                } catch (error) {
                    reject("Error extracting face embedding: " + error);
                }
            };
            img.onerror = () => reject("Error loading image for processing");
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            alert("Please upload an image");
            return;
        }

        setLoading(true);
        try {
            // Step 1: Extract Face Embedding before uploading
            const faceEmbedding = await extractFaceEmbedding(formData.image);

            // Step 2: Upload Image to Cloudinary
            const imageData = new FormData();
            imageData.append("file", formData.image);
            imageData.append("upload_preset", "attendance-tracker-employees");

            const cloudinaryResponse = await axios.post(
                "https://api.cloudinary.com/v1_1/dght66h2c/image/upload",
                imageData
            );

            const imageUrl = cloudinaryResponse.data.secure_url;

            // Step 3: Send Data to Backend
            const employeeData = {
                e_name: formData.e_name,
                e_phone: formData.e_phone,
                image_url: imageUrl,
                faceEmbedding,
            };

            const response = await axios.post("http://localhost:3001/register", employeeData);

            if (response.status === 200) {
                alert("Employee registered successfully!");
                navigate("/");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Link to='../employees'>Employee Records</Link>
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

            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Registering..." : "Submit"}
            </button>
        </form>
        </>
    );
}

export default RegisterEmployee;
