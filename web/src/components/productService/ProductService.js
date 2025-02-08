import React, {useState} from 'react';
import SearchDataInputOrDownload from './SearchDataInputOrDownload';
import AnswerFromSearch from './AnswerSearch';

const ProductsService = (props) => {
    // запрос данных
    const [commonRequest, setCommonRequest] = useState({});
    // ответ после поиска
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