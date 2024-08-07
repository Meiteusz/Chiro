import React from 'react';

import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import './styles.css';

function APIUnavailable() {
  return (
    <div className="container">
      <BuildRoundedIcon fontSize="large" className="icon" />
      <h1>Serviço temporariamente fora do ar!</h1>
      <p>Estamos enfrentando problemas técnicos. Tente novamente mais tarde.</p>
    </div>       
  );
}

export default APIUnavailable;  
