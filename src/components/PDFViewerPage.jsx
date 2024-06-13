import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import "../styles.css";
import "../styles/PDFViewerPage.css";

// Configure the worker to use the locally hosted mjs file
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const PDFViewerPage = () => {
  const { id } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState("");
  const [scale, setScale] = useState(1.0); // State to manage zoom level
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

  const zoomIn = () => {
    setScale((prevScale) => prevScale + 0.2); // Increase scale by 0.2
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.2)); // Decrease scale by 0.2, minimum 0.2
  };

  return (
    <div className="pdf-viewer">
      <div className="document">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div>Loading PDF...</div>}
          noData={<div>No PDF file specified.</div>}
          error={<div>Error loading PDF.</div>}
          className="document-content"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale} // Set the scale
            renderTextLayer={false} // Disable text layer
            renderAnnotationLayer={false} // Disable annotation layer
          />
        </Document>
      </div>
      <div className="button-sec">
        <div className="zoom-sec">
          <button onClick={zoomOut} className="zoom-o">
            <b>-</b>
          </button>
          <button onClick={zoomIn} className="zoom-i">
            <b>+</b>
          </button>
        </div>
        <p className="page-number">
          Page {pageNumber} of {numPages}
        </p>
        <div className="page-button-sec">
          <button
            disabled={pageNumber <= 1}
            onClick={goToPreviousPage}
            className="pre-button"
          >
            Prev
          </button>
          <button
            disabled={pageNumber >= numPages}
            onClick={goToNextPage}
            className="next-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerPage;
