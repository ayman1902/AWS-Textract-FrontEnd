import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [file, setFile] = useState(null);          // Store the selected file
  const [uploaded, setUploaded] = useState(false); // Track upload status
  const [loading, setLoading] = useState(false);   // Show loading state during API calls
  const [documents, setDocuments] = useState([]);  // Store extracted documents

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to S3 (replace with your S3 presigned URL logic)
  const handleUpload = async () => {
    if (!file) {
      return alert('Please select a file.');
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      // Replace <S3_PRESIGNED_URL> with the actual presigned URL from your backend
      const response = await axios.put('<S3_PRESIGNED_URL>', formData, {
        headers: {
          'Content-Type': file.type,
        },
      });

      if (response.status === 200) {
        setUploaded(true);
        alert('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch processed documents via API Gateway
  const fetchDocuments = async () => {
    setLoading(true);

    try {
      // Replace <API_GATEWAY_ENDPOINT> with your API Gateway endpoint
      const response = await axios.get('<API_GATEWAY_ENDPOINT>/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      alert('Error fetching documents.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Document Processing Application</h1>

      {/* File Upload */}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Uploading...' : 'Upload Document'}
      </button>

      {/* Fetch Processed Documents */}
      <button onClick={fetchDocuments} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Processed Documents'}
      </button>

      {/* Display extracted documents */}
      {uploaded && <p>File uploaded successfully!</p>}
      <div>
        <h2>Extracted Documents</h2>
        <ul>
          {documents.map((doc, index) => (
            <li key={index}>
              <strong>{doc.documentName}</strong>: {doc.extractedText}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
