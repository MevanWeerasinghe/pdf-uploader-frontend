import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import "../styles.css";

// Configure the worker to use the locally hosted mjs file
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const PDFViewerPage = () => {
  const { id } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    API.get(`/pdfs/${id}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setPdfUrl(url);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, token]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page on new document load
  };

  const goToPreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  };

  return (
    <div className="container">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
        noData={<div>No PDF file specified.</div>}
        error={<div>Error loading PDF.</div>}
      >
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false} // Disable text layer
          renderAnnotationLayer={false} // Disable annotation layer
        />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <div>
        <button disabled={pageNumber <= 1} onClick={goToPreviousPage}>
          Previous
        </button>
        <button disabled={pageNumber >= numPages} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewerPage;
