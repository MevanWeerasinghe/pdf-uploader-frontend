import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import "../styles.css";
import "../styles/Homepage.css";

const HomePage = () => {
  const [pdfs, setPdfs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const { token, logout } = useAuth();
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await API.get("/pdfs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPdfs(response.data);
        setSearchResults(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout();
        } else {
          console.error(error);
        }
      }
    };
    fetchPdfs();
  }, [token, logout]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError(""); // Clear upload error on file selection
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("You first need to choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("title", selectedFile.name);

    try {
      const response = await API.post("/pdfs/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setPdfs([...pdfs, response.data]);
      setSearchResults([...pdfs, response.data]);
      setSelectedFile(null);
      fileInputRef.current.value = "";
      setUploadError(""); // Clear upload error after successful upload
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout();
      } else {
        console.error(error);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError("Search text is not included.");
      return;
    }

    try {
      const response = await API.get(`/pdfs/search/${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data);
      setIsSearching(true);
      setSearchError(""); // Clear search error after successful search
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout();
      } else {
        console.error(error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/pdfs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedPdfs = pdfs.filter((pdf) => pdf._id !== id);
      setPdfs(updatedPdfs);
      setSearchResults(updatedPdfs);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout();
      } else {
        console.error(error);
      }
    }
  };

  const handleResetSearch = () => {
    setSearchResults(pdfs);
    setIsSearching(false);
    setSearchQuery("");
    setSearchError(""); // Clear search error on reset
  };

  return (
    <div className="homepage-container">
      <div className="sticky-sec">
        <div className="homepage-head">
          <h1 className="homepage-header">PDF Uploader</h1>
          <button onClick={logout} className="logout-button">
            <b>Logout</b>
          </button>
        </div>
        <div className="upload-sec">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            ref={fileInputRef}
          />
          <button onClick={handleUpload} className="upload-button">
            <b>Upload</b>
          </button>
          {uploadError && <p className="error-message">{uploadError}</p>}
        </div>
        <div className="pdf-sec-header">
          <h2 className="pdf-header">Uploaded PDFs</h2>
          <div className="search-sec">
            {searchError && <p className="error-message">{searchError}</p>}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title"
              className="search-input"
            />
            {isSearching && (
              <button onClick={handleResetSearch} className="reset-button">
                <img src="/icons/back.png" alt="search" className="back-icon" />
              </button>
            )}
            <button onClick={handleSearch} className="search-button">
              <img
                src="/icons/search.png"
                alt="search"
                className="search-icon"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="pdf-list">
        {searchResults.map((pdf) => (
          <div key={pdf._id} className="pdf">
            <div className="pdf-link-sec">
              <div className="dot" />
              <Link to={`/pdf/${pdf._id}`}>{pdf.title}</Link>
            </div>
            <button
              onClick={() => handleDelete(pdf._id)}
              className="delete-button"
            >
              <img
                src="/icons/delete.png"
                alt="Delete"
                className="delete-icon"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
