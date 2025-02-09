import React, {useState} from 'react';
import SearchDataInputOrDownload from './SearchDataInputOrDownload';
import AnswerFromSearch from './AnswerSearch';

const ProductsService = (props) => {
    // request data
    const [commonRequest, setCommonRequest] = useState({});
    // answer after search
    const [answerAfterSearch, setAnswerAfterSearch] = useState(null);

    return (
        <div>
            <div>
                <div>
                    <SearchDataInputOrDownload
                        {...props}
                        commonRequest={commonRequest}
                        setCommonRequest={setCommonRequest}
                        setAnswerAfterSearch={setAnswerAfterSearch}
                    />
                    {answerAfterSearch &&
                        <AnswerFromSearch
                            answerAfterSearch={answerAfterSearch}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default ProductsService;