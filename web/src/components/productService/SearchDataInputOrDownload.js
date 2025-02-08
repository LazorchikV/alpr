import React, { useState } from 'react';
import {dataProvider} from '../fetchData/dataProvider';
import {apiUrl, FETCH_METHOD} from '../constants';
import Spinner from '../Spinner/Spinner';
import FileUpload from '../Upload/FileUpload';

const SearchDataInputOrDownload = ({
                                       permissions,
                                       commonRequest,
                                       setCommonRequest,
                                       setAnswerAfterSearch,
                                       ...rest
                                   }) => {
    const [inputText, setInputText] = useState('');
    const [file, setFile] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const [bufferFile, setBufferFile] = useState({});

    const handleTextInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSubmit = async (event) => {
        if (!inputText && !file) return;
        setIsSearch(true);
        event.preventDefault();
        setCommonRequest(() => ({permissions, file, inputText}));

        try {
            const {data} = await dataProvider(`${apiUrl}/upload`, FETCH_METHOD.POST, {
                permissions,
                file: bufferFile,
                text: inputText
            });
            setIsSearch(false);
            setAnswerAfterSearch(() => data);
        } catch (e) {
            setIsSearch(false);
            throw new Error(e.message);
        }
    };

    if (isSearch) return <Spinner/>

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter text or link:
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleTextInputChange}
                    />
                </label>
                <br />
                <label>
                    Upload file with products name or links to products:
                    <FileUpload file={file} setFile={setFile} setBufferFile={setBufferFile}/>
                </label>
                <br />
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
}

export default SearchDataInputOrDownload;
