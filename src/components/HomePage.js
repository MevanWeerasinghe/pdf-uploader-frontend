import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import "../styles.css";
import "../styles/Homepage.css";

const HomePage = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const { token, logout } = useAuth();
  const fileInputRef = useRef(); // Reference to the file input

  useEffect(() => {
    API.get("/pdfs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setPdfs(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          logout(); // Logout if token is expired
        } else {
          console.error(error);
        }
      });
  }, [token, logout]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Update state with the selected file
  };

  const handleUpload = () => {
    if (!selectedFile) return; // Return if no file is selected

    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("title", selectedFile.name);

    API.post("/pdfs/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        setPdfs([...pdfs, response.data]);
        setSelectedFile(null); // Clear the selected file after upload
        fileInputRef.current.value = ""; // Clear the file input field
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          logout(); // Logout if token is expired
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div className="homepage-container">
      <div className="sticky-sec">
        <div className="homepage-head">
          <h1 className="homepage-header">Upload PDF</h1>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
        <div className="upload-sec">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            ref={fileInputRef} // Attach the ref to the file input
          />
          <button onClick={handleUpload} className="upload-button">
            Upload
          </button>
        </div>
        <div className="pdf-sec-header">
          <h2 className="pdf-header">Uploaded PDFs</h2>
        </div>
      </div>
      <div className="pdf-list">
        {pdfs.map((pdf) => (
          <div key={pdf._id} className="pdf">
            <Link to={`/pdf/${pdf._id}`}>{pdf.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
