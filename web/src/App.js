import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import Sidebar from "./components/Sidebar/Sidebar";
import LoginForm from "./components/Login/LoginForm";
import Account from "./components/Sidebar/pages/Account";
import CityParkingMap from "./components/Sidebar/pages/CityParkingMap";
import RecognizePlates from "./components/Sidebar/pages/RecognizePlates";
import VideoSurveillance from "./components/Sidebar/pages/VideoSurveillance";
import ProductsService from "./components/productService/ProductService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (formData) => {
    console.log("Логин:", formData);
    setIsAuthenticated(true); // Validation authorization
  };

  return (
    <Router>
      <CssBaseline />
      {isAuthenticated ? (
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/account" />} />
              <Route path="/account" element={<Account />} />
              <Route path="/city-parking-map" element={<CityParkingMap />} />
              <Route path="/recognize-plates" element={<RecognizePlates />} />
              <Route path="/document-parsing" element={<ProductsService />} />
              <Route path="/video-surveillance" element={<VideoSurveillance />} />
              <Route path="*" element={<Navigate to="/account" />} />
            </Routes>
          </Box>
        </Box>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </Router>
  );
}

export default App;
