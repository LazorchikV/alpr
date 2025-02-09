import React, {useState} from 'react';
import PhotoDownload from './PhotoDownload';
import AnswerAfterDownload from './AnswerAfterDownload';

const PhotoRecognition = (props) => {
    // request data
    const [commonRequest, setCommonRequest] = useState({});
    // answer after recognition
    const [answer, setAnswer] = useState(null);

    return (
        <div>
            <div>
                <div>
                    <PhotoDownload
                        {...props}
                        commonRequest={commonRequest}
                        setCommonRequest={setCommonRequest}
                        setAnswer={setAnswer}
                    />
                    {answer &&
                    <AnswerAfterDownload
                        answer={answer}
                    />
                    }
                </div>
            </div>
        </div>
    );
};

export default PhotoRecognition;