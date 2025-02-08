export const FETCH_METHOD = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    PATCH: 'PATCH',
    PUT: 'PUT'
};
const serverHostingURL = '';
const isLocal = true;
const PORT = 3001;
const baseUrl = `http://localhost:${PORT}`;

export const apiUrl = isLocal ? `${baseUrl}/api` : serverHostingURL;
export const aiUrl = isLocal ? `${baseUrl}/ai` : serverHostingURL;
export const authorizationToken = 'ehjioejfviosdjosv655854fvsfv48d5f4v8df4v';


export const uploadFileStatus = {
    upload: 'Upload file',
    error: 'File not uploaded',
    success: 'File uploaded successfully',
    uploading: 'Uploading...'
};