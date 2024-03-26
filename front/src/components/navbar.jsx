"use client";

import { useState } from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

function Navbar() {
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
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleOpenMenuButtons}
        >
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
          <MenuItem onClick={() => window.location.replace("/")}>
            Novo Projeto
          </MenuItem>
          <MenuItem onClick={() => window.location.replace("/")}>
            Ver Projetos
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>Criar Link</MenuItem>
        </Menu>
        <label style={{ fontWeight: 600, fontSize: "20px" }}>Projeto 1</label>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
