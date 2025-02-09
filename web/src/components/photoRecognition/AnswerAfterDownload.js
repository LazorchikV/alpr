import { useEffect, useRef, useState } from "react";
import { Box, Typography, Card, CardContent, Stack, Paper } from "@mui/material";

const AnswerAfterDownload = ({ answer }) => {
  const { imageUrl, Labels: labels = [], recognizePlate = {} } = answer || {};
  const { text = "", boundingBox } = recognizePlate;
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log("Answer", { answer });

  useEffect(() => {
    if (!imageLoaded || !boundingBox || !canvasRef.current || !imageRef.current) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas dimensions to be the same as the image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuring frame styles
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.globalAlpha = 1;

    // Checking if coordinates need to be scaled
    const scaleX = image.clientWidth / image.naturalWidth;
    const scaleY = image.clientHeight / image.naturalHeight;

    // If `boundingBox` is already in pixels, do not multiply by `scaleX`
    const x = boundingBox.x * scaleX;
    const y = boundingBox.y * scaleY;
    const width = boundingBox.width * scaleX;
    const height = boundingBox.height * scaleY;

    // Drawing a frame
    ctx.strokeRect(x, y, width, height);
  }, [imageLoaded, boundingBox]);

  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} mt={4}>
      <Paper
        elevation={4}
        sx={{
          width: 300,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "white",
          border: "2px solid black",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" color="goldenrod" sx={{ fontWeight: "bold" }}>
          {text || "Not found"}
        </Typography>
      </Paper>
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

      {/* Image with overlay frame */}
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
