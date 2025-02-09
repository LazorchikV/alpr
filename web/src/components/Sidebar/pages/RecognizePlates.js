import React from "react";
import PhotoRecognition from '../../photoRecognition/PhotoRecognition';
import ProductsService from '../../productService/ProductService';
import Tabs from '../../Tabs/Tabs';

const RecognizePlates = () => {
  return (
    <div>
      <Tabs>
        <div label="Photo Recognition">
          <PhotoRecognition/>
        </div>
        <div label="Document parsing">
          <ProductsService/>
        </div>
      </Tabs>
    </div>
  );
};

export default RecognizePlates;
