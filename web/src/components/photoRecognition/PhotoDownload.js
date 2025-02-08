import React, { useState } from 'react';
import FileDownload from './FileDownload';

const PhotoDownload = ({
                                       permissions,
                                       commonRequest,
                                       setCommonRequest,
                                       setAnswer,
                                       ...rest
                                   }) => {
    const [file, setFile] = useState(null);

    return (
        <div>
            <form>
                <label>
                    Upload file with photo:
                    <FileDownload file={file} setFile={setFile} setAnswer={setAnswer}/>
                </label>
                <br />
            </form>
        </div>
    );
}

export default PhotoDownload;
