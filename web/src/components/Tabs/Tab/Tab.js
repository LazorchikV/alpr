import React from 'react';
import { Tab } from "@mui/material";

const TabComponent = ({ label, activeTab, onClick }) => {
    return (
      <Tab
        label={label}
        onClick={() => onClick(label)}
        sx={{
            backgroundColor: activeTab === label ? "blue" : "grey",
            color: activeTab === label ? "white" : "black",
            fontWeight: activeTab === label ? "bold" : "normal",
            borderRadius: "10px",
            textTransform: "none",
            margin: '10px',
        }}
      />
    );
};

export default TabComponent;
