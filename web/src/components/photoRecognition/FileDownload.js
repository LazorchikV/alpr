import React, { useState } from 'react';
import axios from 'axios';
import { uploadFileStatus } from '../constants';

const FileDownload = ({ file, setFile, setAnswer }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Получаем файл из input
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData(); // Создаем объект FormData
        formData.append('file', file); // Добавляем файл в FormData под именем "file"

        try {
            setUploading(true);
            const response = await axios.post('http://localhost:3001/ai', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Указываем тип содержимого
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            console.log('File uploaded successfully:', response.data);
            setAnswer(() => response.data);
            setUploading(false);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                    uploadProgress < 100 ? uploadFileStatus.uploading : uploadFileStatus.success
                ) : (
                    uploadFileStatus.upload
                )}
            </button>
            {uploading && (
                <div>
                    <label>Upload Progress:</label>
                    <progress value={uploadProgress} max="100">
                        {uploadProgress}%
                    </progress>
                </div>
            )}
        </div>
    );
};

export default FileDownload;
