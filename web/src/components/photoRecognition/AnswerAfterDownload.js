import { Fragment, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Stack, Paper } from "@mui/material";

const AnswerAfterDownload = ({ answer }) => {
  const { imageUrl, Labels: labels = [], recognizePlate = {} } = answer || {};
  const { text = '', boundingBox } = recognizePlate;

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

  const handleLabels = (labels) => {
    const isCucumber = labels.some((label) => label.Name === "Cucumber");
    return '';
  };

  useEffect(() => {
    handleLabels(filteredLabels);
  }, [filteredLabels]);

  const drawBoundingBox = (image, boundingBox) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    const x = boundingBox.Left * canvas.width;
    const y = boundingBox.Top * canvas.height;
    const width = boundingBox.Width * canvas.width;
    const height = boundingBox.Height * canvas.height;

    ctx.strokeRect(x, y, width, height);
    document.body.appendChild(canvas);
  }

  return (
    <Fragment>
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
      </Box>
      {imageUrl && (
        <Box position="relative" mt={2}>
          <img
            src={imageUrl}
            alt="Uploaded image file"
            style={{ width: "100%", maxWidth: "500px", border: "2px solid black" }}
          />
          {boundingBox && (
            <Box
              position="absolute"
              top={boundingBox.y}
              left={boundingBox.x}
              width={boundingBox.width}
              height={boundingBox.height}
              border="2px solid red"
            />
          )}
        </Box>
      )}
    </Fragment>
  );
};

export default AnswerAfterDownload;
