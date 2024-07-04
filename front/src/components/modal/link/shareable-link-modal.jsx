import React, { useRef } from 'react';
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import "./styles.css";

function ShareableLinkModal({open, url, setOpen}) {
  const handleClose = () => setOpen(false);
  const textFieldRef = useRef(null);

  const handleCopy = () => {
    const textField = textFieldRef.current;
    if (textField) {
      // Copia o valor para a área de transferência
      navigator.clipboard.writeText(url).then(() => {
        console.log('Link copiado para a área de transferência!');
        setOpen(false);
      }).catch(err => {
        console.error('Falha ao copiar o texto: ', err);
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box className="modal-default-style">
        <Stack spacing={2}>
          <TextField 
            id="outlined-disabled"
            label="Link compartilhável"
            variant="outlined"
            disabled
            fullWidth
            value={url}
            InputProps={{
              readOnly: true,
            }}
            inputRef={textFieldRef}
          /> 
          <Button variant="outlined" className="custom-button" onClick={handleCopy}>Copiar link</Button>                   
        </Stack>                         
      </Box>
    </Modal>
  );
}

export default ShareableLinkModal;
