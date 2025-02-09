import React from "react";
import PhotoRecognition from '../../photoRecognition/PhotoRecognition';
import Tabs from '../../Tabs/Tabs';

const RecognizePlates = () => {
  return (
    <div>
      <Tabs>
        <div label="PHOTO RECOGNIZATION">
          <PhotoRecognition/>
        </div>
        <div label="MAP">
          {'MAP'}
        </div>
      </Tabs>
    </div>
  );
};

export default RecognizePlates;
