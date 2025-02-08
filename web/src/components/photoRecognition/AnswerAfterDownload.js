import { useEffect } from "react";

const AnswerAfterDownload = ({ answer }) => {
    const { Labels: labels = [], recognizePlate = '' } = answer?.answer || {};
    console.log('Answer', { answer });

    const filteredLabels = labels?.filter(label => label?.Confidence > 90) || [];

    const displayLabels = (labels) => {
        return labels.map((label) => (
          <div key={label.Name}>
              <h3>{label.Name}</h3>
              <p>Confidence: {label.Confidence?.toFixed(2)}%</p>
              {label.Parents?.length > 0 && (
                <p>Parents: {label.Parents.map((parent) => parent.Name).join(', ')}</p>
              )}
              {label.Categories?.length > 0 && (
                <p>Categories: {label.Categories.map((category) => category.Name).join(', ')}</p>
              )}
          </div>
        ));
    };

    const handleLabels = (labels) => {
        const isCucumber = labels.some((label) => label.Name === 'Cucumber');
        if (isCucumber) {
            console.log("Это огурец! Проверьте его состояние на наличие заболеваний.");
            // Логика проверки заболеваний огурцов
        }
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
    };

    return (
      <div>
          <div
            style={{
                width: '300px',
                height: '200px',
                backgroundColor: 'white',
                border: '2px solid black',
                boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
            }}
          >
              <span style={{ color: 'goldenrod' }}>{recognizePlate}</span>
          </div>
          {displayLabels(filteredLabels)}
      </div>
    );
};

export default AnswerAfterDownload;
