import React from "react";
import PhotoRecognition from '../../photoRecognition/PhotoRecognition';
import Tabs from '../../Tabs/Tabs';
import GoogleMapComponent from '../../map/GoogleMapComponent';

const RecognizePlates = () => {
  return (
    <div>
      <Tabs>
        <div label="PHOTO RECOGNIZATION">
          <PhotoRecognition/>
        </div>
        <div label="GOOGLE MAP">
          <GoogleMapComponent />
        </div>
      </Tabs>
    </div>
  );
};

export default RecognizePlates;
