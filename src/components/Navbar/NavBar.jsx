import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
//
import { useAuth0 } from "@auth0/auth0-react";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Popover } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Icon from "../../assets/logo/logo-corto.png";
import { useScreenSize } from "../../hooks/useScreenSize";
import { getAvatarName } from "../../utils/utils";
import "./NavBar.css";

const drawerWidth = 280;

const userMinScreenSize = 800;
const userNavItems = [
  {
    text: "INICIO",
    to: "/",
    icon: "🏠",
    color: "#58cc02"
  },
  {
    text: "PROGRESO",
    to: "/progress",
    icon: "📊",
    color: "#1cb0f6"
  },
  {
    text: "BIBLIOTECA",
    to: "/library",
    icon: "📚",
    color: "#ff6b35"
  },
  {
    text: "FACTURACIÓN",
    to: "/billing",
    icon: "💳",
    color: "#ffc800"
  },
  {
    text: "VOCABULARIO",
    to: "/vocabulary",
    icon: "📖",
    color: "#a855f7"
  },
];

const adminMinScreenSize = 900;
const adminNavItems = [
  {
    text: "ALUMNOS",
    to: "/users",
    icon: "👥",
    color: "#58cc02"
  },
  {
    text: "INSTITUCIONES",
    to: "/institutions",
    icon: "🏫",
    color: "#1cb0f6"
  },
  {
    text: "EJERCICIOS",
    to: "/exercises",
    icon: "📝",
    color: "#ff6b35"
  },
  {
    text: "TESTER",
    to: "/test",
    icon: "🧪",
    color: "#ffc800"
  },
  {
    text: "DASHBOARD",
    to: "/dashboard",
    icon: "📈",
    color: "#a855f7"
  },
  {
    text: "SUSCRIPCIONES",
    to: "/subscriptions",
    icon: "💎",
    color: "#ff6b6b"
  },
];

const institutionMinScreenSize = 650;
const institutionNavItem = [
  {
    text: "INICIO",
    to: "/own-home",
    icon: "🏠",
    color: "#58cc02"
  },
  {
    text: "ALUMNOS",
    to: "/own-users",
    icon: "👥",
    color: "#1cb0f6"
  },
];

function NavBar(props) {
  const { window: anchorWindow } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [navItems, setNavItems] = React.useState([]);
  const [isMobile, setIsMobile] = React.useState(false);
  const { logout } = useAuth0();

  const { width } = useScreenSize();
  React.useEffect(() => {
    const targetMinWidth = user?.isAdmin
      ? adminMinScreenSize
      : user?.isInstitution
      ? institutionMinScreenSize
      : userMinScreenSize;
    setIsMobile(width <= targetMinWidth);
  }, [width]);

  const { user } = useSelector((state) => state.datos);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  React.useEffect(() => {
    setNavItems(
      user?.isAdmin
        ? adminNavItems
        : user?.isInstitution
        ? institutionNavItem
        : userNavItems
    );
  }, []);

  const sidebarContent = (
    <div className="vertical-sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <img src={Icon} className="sidebar-logo" alt="Logo" />
        <span className="sidebar-brand">iHingles</span>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.text} to={item.to} className="sidebar-nav-link">
            <div 
              className="sidebar-nav-button"
              style={{ '--button-color': item.color }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.text}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="sidebar-user-section">
        <button className="sidebar-avatar-button"/*  onClick={handleAvatarClick} */ style={{cursor: 'default'}}>
          <Avatar className="sidebar-avatar">
            {user?.name && getAvatarName(user?.name)}
          </Avatar>
          <div className="user-info">
            <span className="user-name">{user?.name?.split(' ')[0] || 'Usuario'}</span>
            <span className="user-role">
              {user?.isAdmin ? 'Admin' : user?.isInstitution ? 'Institución' : 'Estudiante'}
            </span>
          </div>
        </button>

        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          <span className="logout-text">CERRAR SESIÓN</span>
        </button>
      </div>

      {/* Popover for Avatar menu */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        className="sidebar-avatar-popover"
      >
        <button className="popover-logout-btn" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          Cerrar sesión
        </button>
      </Popover>
    </div>
  );

  const mobileDrawer = (
    <Box
      onClick={handleDrawerToggle}
      className="game-drawer"
    >
      <div className="drawer-header">
        <img
          className="drawer-logo"
          src={Icon}
          alt="Logo"
        />
        <h3 className="drawer-title">iHingles</h3>
      </div>
      <Divider className="game-divider" />
      <List className="drawer-nav-list">
        {navItems.map((item) => (
          <div key={item.text} className="drawer-nav-item">
            <Link to={item.to} className="drawer-link">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.text}</span>
            </Link>
          </div>
        ))}
        <div className="drawer-nav-item logout-item">
          <button className="drawer-logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">CERRAR SESIÓN</span>
          </button>
        </div>
      </List>
    </Box>
  );

  const container =
    anchorWindow !== undefined ? () => anchorWindow().document.body : undefined;

  return (
    <Box className="navbar-container">
      <CssBaseline />
      
      {/* Mobile Top Bar */}
      {isMobile && (
        <AppBar component="nav" className="mobile-top-bar">
          <Toolbar className="mobile-toolbar">
            <IconButton
              className="menu-button"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            
            <div className="mobile-logo-container">
              <img src={Icon} className="mobile-logo" alt="Logo" />
              <span className="mobile-brand">iHingles</span>
            </div>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Vertical Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          className="desktop-sidebar"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              background: 'transparent',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}
      
      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          className="game-drawer-container"
          sx={{
            display: isMobile ? "block" : "none",
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              height: "100vh",
              background: "transparent",
            },
          }}
        >
          {mobileDrawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default NavBar;
