const containerBoards = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
};

const board = {
  display: "flex",
  flex: 1,
  border: "1px solid black",
};

const topBoard = {
  ...board,
  position: "relative",
  display: "block",
  flex: 1,
};

const timeLine = {
  ...board,
  flex: 0.05,
};

const bottomBoard = {
  ...board,
};

const addBubble = {
  position: "absolute",
  top: "30px",
  right: "30px",
  padding: "20px",
  borderRadius: "50%",
  backgroundColor: "#1C1C1C",
  color: "#fff",
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

export { containerBoards, board, topBoard, timeLine, bottomBoard, addBubble, dateModal };