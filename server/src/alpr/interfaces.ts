interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IRecognition {
  text: string;
  confidence?: number;
  boundingBox?: IBoundingBox;
}


export {
  IRecognition,
}