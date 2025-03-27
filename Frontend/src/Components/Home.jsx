import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import Webcam from "react-webcam";

function Home() {
    const webcamRef = useRef(null);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = process.env.PUBLIC_URL + "/models";  // ✅ Fix model path
                await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
                await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
                await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
                setModelsLoaded(true);
                console.log("✅ FaceAPI models loaded successfully!");
            } catch (error) {
                console.error("❌ Error loading models:", error);
            }
        };
        loadModels();
    }, []);

    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        setEmployee(null);
    };

    const captureAndRecognize = async () => {
        if (!modelsLoaded) {
            alert("Models are still loading. Please wait...");
            return;
        }
    
        setLoading(true);
    
        if (!webcamRef.current || !webcamRef.current.video) {
            console.error("❌ Webcam not initialized");
            setLoading(false);
            return;
        }
    
        const video = webcamRef.current.video;
    
        console.log("📸 Capturing face...");
        const face = await faceapi.detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.4 })
        ).withFaceLandmarks().withFaceDescriptor();
    
        if (!face) {
            alert("❌ No face detected! Ensure good lighting and try again.");
            setLoading(false);
            return;
        }
    
        console.log("✅ Face detected!");
        const faceEmbedding = Array.from(face.descriptor);
    
        if (!Array.isArray(faceEmbedding) || faceEmbedding.length === 0) {
            console.error("Invalid face embedding:", faceEmbedding);
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:3001/recognize", { faceEmbedding });
            
            if (response.data.match) {
                setEmployee(response.data.employee);
            } else {
                alert("⚠ Face not recognized! Try again.");
            }
        } catch (error) {
            console.error("❌ Error recognizing face:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const confirmAttendance = async () => {
        if (!employee) return;

        try {
            await axios.post("http://localhost:3001/mark-attendance", { employee_id: employee.id });
            alert("✅ Attendance marked successfully!");
            closeModal();
        } catch (error) {
            console.error("❌ Error marking attendance:", error);
        }
    };

    return (
        <>
            <Link to='login'><button className="btn btn-info">Login As Admin</button></Link>
            <button className="btn btn-warning" onClick={openModal}>Mark Attendance</button>

            {/* Bootstrap Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Face Recognition</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body text-center">
                                <Webcam 
                                    ref={webcamRef} 
                                    screenshotFormat="image/jpeg" 
                                    width={640} 
                                    height={480}
                                    videoConstraints={{ width: 640, height: 480, facingMode: "user" }} 
                                />

                                {/* Bootstrap Spinner while loading */}
                                {loading ? (
                                    <div className="mt-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Processing...</span>
                                        </div>
                                        <p>Processing...</p>
                                    </div>
                                ) : (
                                    <button className="btn btn-primary mt-3" onClick={captureAndRecognize} disabled={!modelsLoaded}>
                                        Scan Face
                                    </button>
                                )}

                                {employee && (
                                    <div className="mt-3">
                                        <h5>Is this you?</h5>
                                        <p><strong>Name:</strong> {employee.e_name}</p>
                                        <p><strong>Phone:</strong> {employee.e_phone}</p>
                                        <button className="btn btn-success" onClick={confirmAttendance}>Yes, Mark Attendance</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Overlay */}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </>
    );
}

export default Home;
