import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded"; // Ícone de rede fora do ar

import "./styles.css";

const ErrorNetwork = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="error-container">
      <div className="error-content">
        <WifiOffRoundedIcon fontSize="large" className="icon" />
        <h1 className="error-title">Serviço temporariamente fora do ar!</h1>
        <p className="error-description">Tente novamente mais tarde.</p>
        <button onClick={handleRetry} className="error-link">
          Tentar novamente
        </button>
      </div>
    </div>
  );
};

export default ErrorNetwork;
