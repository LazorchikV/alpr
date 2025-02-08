import {authorizationToken} from '../constants';
import ProductsService from '../productService/ProductService';
import {useEffect, useState} from 'react';
import Tabs from '../Tabs/Tabs';
import PhotoRecognition from '../photoRecognition/PhotoRecognition';

const Login = ({login, password}) => {
    const [isUser, setIsUser] = useState();
    // TO DO logic Registration and check SignIn
    useEffect(() => {
        setIsUser(true);
    }, []);

    return(
        <div>
            <Tabs>
                <div label="Photo Recognition">
                    {isUser && <PhotoRecognition permissions={authorizationToken}/>}
                </div>
                <div label="Document parsing">
                    {isUser && <ProductsService permissions={authorizationToken}/>}
                </div>
            </Tabs>
    </div>);
};

export default Login;