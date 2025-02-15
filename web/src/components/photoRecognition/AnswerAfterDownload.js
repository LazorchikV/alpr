import { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography, Stack, Card, CardContent } from "@mui/material";

const AnswerAfterDownload = ({ answer }) => {
  const { imageUrl, recognizedPlate = [], Labels: labels = [] } = answer || {};
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageLoaded || recognizedPlate.length === 0 || !canvasRef.current || !imageRef.current) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas dimensions according to image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Frame settings
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.globalAlpha = 1;

    // Scaling coordinates
    const scaleX = image.clientWidth / image.naturalWidth;
    const scaleY = image.clientHeight / image.naturalHeight;

    recognizedPlate.forEach(({ boundingBox }) => {
      if (boundingBox) {
        const x = boundingBox.x * scaleX;
        const y = boundingBox.y * scaleY;
        const width = boundingBox.width * scaleX;
        const height = boundingBox.height * scaleY;

        // Draw a frame around the license plate
        ctx.strokeRect(x, y, width, height);
      }
    });
  }, [imageLoaded, recognizedPlate]);

  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} mt={4}>
      {/* Display numbers */}
      <Paper
        elevation={4}
        sx={{
          width: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "white",
          border: "2px solid black",
          boxShadow: 3,
          p: 2,
        }}
      >
        {recognizedPlate.length > 0 ? (
          recognizedPlate.map(({ text, confidence }, index) => (
            <Typography key={index} variant="h6" color="goldenrod" sx={{ fontWeight: "bold" }}>
              {text || "Not found"} {confidence ? `(${(confidence * 100).toFixed(2)}%)` : ""}
            </Typography>
          ))
        ) : (
          <Typography variant="h5" color="goldenrod" sx={{ fontWeight: "bold" }}>
            Not found
          </Typography>
        )}
      </Paper>

      {/* Label output from AWS Rekognition */}
      <Stack
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "50px 30px",
          justifyContent: "center",
        }}
      >
        {labels.map((label) => (
          <Card key={label.Name} sx={{ minWidth: 250, m: 1 }}>
            <CardContent>
              <Typography variant="h6">{label.Name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Confidence: {label.Confidence?.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Image with frames */}
      {imageUrl && (
        <Box sx={{ position: "relative", mt: 2, display: "inline-block" }}>
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Uploaded image file"
            style={{ width: "100%", maxWidth: "500px", border: "2px solid black" }}
            onLoad={() => setImageLoaded(true)}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AnswerAfterDownload;
