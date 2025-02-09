import React, { useState } from 'react';
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import axios from 'axios';
import { aiUrl, uploadFileStatus } from '../constants';

const FileDownload = ({ file, setFile, setAnswer }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Get file from input
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData(); // Create object FormData
        formData.append('file', file); // Add a file to FormData named "file"

        try {
            setUploading(true);
            const response = await axios.post(`${aiUrl}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Specify the content type
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            console.log('File uploaded successfully:', response.data);
            setAnswer(() => response.data);
            setUploading(false);
            setFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploading(false);
            setFile(null);
        }
    };

    return (
      <Box display="flex" flexDirection="column" gap={2} alignItems="center" width="100%">
          {!file ? <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                    <Button variant="contained" component="span">
                        Choose a file
                    </Button>
                </label>
            </div> :
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={uploading}
            >
                {uploading ? (uploadProgress < 100 ? uploadFileStatus.uploading : uploadFileStatus.success) : uploadFileStatus.upload}
            </Button> }
          {uploading && (
            <Box width="100%" textAlign="center">
                <Typography variant="body2">Loading: {uploadProgress}%</Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
      </Box>
    );
};

export default FileDownload;
