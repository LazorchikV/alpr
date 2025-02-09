import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { AccountCircle, Map, DirectionsCar, Videocam, Description } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { text: "Account", icon: <AccountCircle />, path: "/account" },
    { text: "City Parking Map", icon: <Map />, path: "/city-parking-map" },
    { text: "Recognize Plate Numbers", icon: <DirectionsCar />, path: "/recognize-plates" },
    { text: "Document Parsing", icon: <Description />, path: "/document-parsing" },
    { text: "Video Surveillance", icon: <Videocam />, path: "/video-surveillance" },
  ];

  return (
    <Drawer variant="permanent" sx={{ width: 300, flexShrink: 0 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

