import { useEffect, useRef, useState } from "react";
import { Box, Typography, Card, CardContent, Stack, Paper } from "@mui/material";

const AnswerAfterDownload = ({ answer }) => {
  const { imageUrl, Labels: labels = [], recognizePlate = {} } = answer || {};
  const { text = "", boundingBox } = recognizePlate;
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log("Answer", { answer });

  const filteredLabels = labels?.filter((label) => label?.Confidence > 90) || [];

  const displayLabels = (labels) => {
    return labels.map((label) => (
      <Card key={label.Name} sx={{ minWidth: 250, m: 1 }}>
        <CardContent>
          <Typography variant="h6">{label.Name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Confidence: {label.Confidence?.toFixed(2)}%
          </Typography>
          {label.Parents?.length > 0 && (
            <Typography variant="body2">
              Parents: {label.Parents.map((parent) => parent.Name).join(", ")}
            </Typography>
          )}
          {label.Categories?.length > 0 && (
            <Typography variant="body2">
              Categories: {label.Categories.map((category) => category.Name).join(", ")}
            </Typography>
          )}
        </CardContent>
      </Card>
    ));
  };

  useEffect(() => {
    if (!imageLoaded || !boundingBox || !canvasRef.current || !imageRef.current) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas sizes to match the image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;

    // ** If boundingBox is in relative coordinates (0-1), multiply by the dimensions **
    const isRelative = boundingBox.x < 1 && boundingBox.y < 1 && boundingBox.width < 1 && boundingBox.height < 1;
    const x = isRelative ? boundingBox.x * canvas.width : boundingBox.x;
    const y = isRelative ? boundingBox.y * canvas.height : boundingBox.y;
    const width = isRelative ? boundingBox.width * canvas.width : boundingBox.width;
    const height = isRelative ? boundingBox.height * canvas.height : boundingBox.height;

    // ** Drawing a frame **
    ctx.strokeRect(x, y, width, height);
  }, [boundingBox, imageLoaded]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 3 }}>
      <Paper
        elevation={3}
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
      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
        {displayLabels(filteredLabels)}
      </Stack>
      {imageUrl && (
        <Box position="relative" mt={2} sx={{ display: "flex", justifyContent: "center" }}>
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Uploaded image file"
            style={{ width: "100%", maxWidth: "500px", border: "2px solid black" }}
            onLoad={() => setImageLoaded(true)} // ✅ Rendering frame after loading
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none", // 🔹 Canvas does not interfere with interaction
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AnswerAfterDownload;
