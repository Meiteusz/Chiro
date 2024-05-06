const containerBoards = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflowY: "hidden",
};

const board = {
  flex: 1,
};

const topBoard = {
  ...board,
  flex: 1,
};

const timeLine = {
  ...board,
  flex: 1,
};

const addBubble = {
  position: "fixed",
  top: "60px",
  right: "30px",
  padding: "15px",
  borderRadius: "50%",
  backgroundColor: "#1C1C1C",
  color: "#fff",
  zIndex: "999"
};

const dateModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  bgcolor: "background.paper",
  color: "#1F1F1F",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  padding: "30px 20px 30px 30px",
  borderRadius: "10px",
};

export { containerBoards, board, topBoard, timeLine, addBubble, dateModal };