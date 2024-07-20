import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import ProjectService from "@/services/requests/project-service";
import { TextField, Button } from "@mui/material";

import ShareableLinkModal from "@/components/modal/link/shareable-link-modal";
import BoardWithoutAuthenticationService from "@/services/requests/board-without-authentication-service";

import "@/app/globals.css";
import DeleteDialog from "@/components/modal/delete-dialog/delete-dialog";

function Navbar({ projectName, showMenu, projectId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [url, setUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [newProjectName, setNewProjectName] = useState(projectName);
  const textFieldRef = useRef(null);
  const openMenu = Boolean(anchorEl);
  const router = useRouter();

  useEffect(() => {
    setNewProjectName(projectName);
  }, [projectName]);

  useEffect(() => {
    if (editing && textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.select();
    }
  }, [editing]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleConfirm = () => {
    ProjectService.deleteAsync(projectId);
    setModalOpen(false);
    router.push("/projects");
  };

  const handleOpenMenuButtons = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenShareableLinkModal = async () => {
    const url = await BoardWithoutAuthenticationService.createLink(projectId);
    setUrl(url);
    setAnchorEl(null);
    setOpenModal(true);
  };

  const handleCloseShareableLinkModal = () => {
    setOpenModal(false);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    if (newProjectName) {
      ProjectService.changeName({
        Id: projectId,
        Name: newProjectName,
      });
      setNewProjectName(newProjectName);
    } else {
      setNewProjectName(projectName);
    }

    setEditing(false);
  };

  const handleChange = (event) => {
    setNewProjectName(event.target.value);
  };

  return (
    <div>
      <ShareableLinkModal
        open={openModal}
        url={url}
        setOpen={handleCloseShareableLinkModal}
      />
      <DeleteDialog
        open={modalOpen}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      />
      <AppBar
        style={{
          background: "#1C1C1C",
          position: "absolute",
          left: 0,
          width: !showMenu ? "200px" : "15%",
          minWidth: showMenu && "400px",
          height: "45px",
          borderRadius: "0 0 10px 0",
        }}
      >
        <Toolbar
          variant="dense"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              overflowX: "hidden",
            }}
          >
            {showMenu && (
              <div>
                <IconButton
                  onClick={handleOpenMenuButtons}
                  color="inherit"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                >
                  <MenuItem
                    onClick={() => router.push("/projects")}
                    style={{
                      fontFamily: "'Segoe UI', sans-serif",
                      fontWeight: "600",
                    }}
                  >
                    Ver Projetos
                  </MenuItem>
                  <MenuItem
                    onClick={handleOpenShareableLinkModal}
                    style={{
                      fontFamily: "'Segoe UI', sans-serif",
                      fontWeight: "600",
                    }}
                  >
                    Criar Link
                  </MenuItem>
                </Menu>
              </div>
            )}
            {editing ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  variant="standard"
                  value={newProjectName}
                  onChange={handleChange}
                  size="small"
                  inputRef={textFieldRef}
                  sx={{
                    input: {
                      color: "white",
                      fontFamily: "'Segoe UI', sans-serif",
                      fontWeight: 600,
                      fontSize: "18px",
                    },
                  }}
                />
              </div>
            ) : (
              <label
                style={{
                  fontWeight: 600,
                  fontSize: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                {newProjectName ?? projectName}
              </label>
            )}
          </div>
          {showMenu && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "nowrap",
              }}
            >
              {editing ? (
                <IconButton
                  color="inherit"
                  aria-label="confirm"
                  onClick={handleSaveClick}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  color="inherit"
                  aria-label="edit"
                  onClick={handleEditClick}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                color="inherit"
                aria-label="delete"
                onClick={handleOpen}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
