import React, {useState} from 'react';
import PhotoDownload from './PhotoDownload';
import AnswerAfterDownload from './AnswerAfterDownload';

const PhotoRecognition = (props) => {
    // запрос данных
    const [commonRequest, setCommonRequest] = useState({});
    // ответ после поиска
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