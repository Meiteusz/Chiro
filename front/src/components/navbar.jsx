import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu"; // Importe o ícone do menu aqui
function Navbar({ 
  projectName, 
  showMenu,
  showNewProject,
  showViewProjects,
  showCreateLink,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenuButtons = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ background: "#1C1C1C" }}>
      <Toolbar variant="dense">
        {showMenu && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleOpenMenuButtons}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
          {showNewProject && (
            <MenuItem onClick={() => window.location.replace("/")}>
              Novo Projeto
            </MenuItem>
          )}
          {showViewProjects && (
            <MenuItem onClick={() => window.location.replace("/")}>
              Ver Projetos
            </MenuItem>
          )}
          {showCreateLink && (
            <MenuItem onClick={handleCloseMenu}>Criar Link</MenuItem>
          )}
        </Menu>
        <label style={{ fontFamily: "Segoe UI", fontWeight: 600, fontSize: "20px" }}>{projectName}</label>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;