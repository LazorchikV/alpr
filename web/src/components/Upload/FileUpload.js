import React, { useState } from 'react';
import {uploadFileStatus} from '../constants';

const FileUpload = ({file, setFile, setBufferFile}) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!file) return;

        // Читаем файл как ArrayBuffer
        const reader = new FileReader();
        onUploadProgress({loaded: 1, total: 100});
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            const arrayBuffer = reader.result;
            setBufferFile((buffer) => ({...buffer, arrayBuffer}));

            setUploading(true);
            onUploadProgress({loaded: 50, total: 100})
            onUploadProgress({loaded: 100, total: 100})
        };

        reader.onerror = () => {
            console.error('Error reading file');
        };
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {
                    uploading ? (
                        uploading && uploadProgress < 100 ? uploadFileStatus.uploading : uploadFileStatus.success
                        ) : uploadFileStatus.upload
                }
            </button>
            {uploading && (
                <div>
                    <label>Upload Progress:</label>
                    <progress value={uploadProgress} max="100">{uploadProgress}%</progress>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
