import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import "../styles.css";

const HomePage = () => {
  const [pdfs, setPdfs] = useState([]);
  const { token, logout } = useAuth();
  // const navigate = useNavigate();

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

  const handleUpload = (e) => {
    const formData = new FormData();
    formData.append("pdf", e.target.files[0]);
    formData.append("title", e.target.files[0].name);

    API.post("/pdfs/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        setPdfs([...pdfs, response.data]);
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
    <div className="container">
      <h1 className="text-2xl">Upload PDF</h1>
      <input type="file" onChange={handleUpload} />
      <button onClick={logout} className="logout-button">
        Logout
      </button>
      <h2 className="text-xl">Uploaded PDFs</h2>
      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf._id}>
            <Link to={`/pdf/${pdf._id}`}>{pdf.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
