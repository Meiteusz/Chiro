"use client";

import { useState, useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import BubbleTask from "@/components/bubble-v2/bubble-task";
import ClassicButton from "@/components/ui/buttons";
import Navbar from "@/components/navbar";
import Timeline from "@/pages/project-board/timeline";
import * as styles from "@/pages/project-board/styles";

import "@/app/globals.css";
import "../../components/bubble-v2/styles.css";

let idCounter = 0;

const getId = () => {
  idCounter++;
  return idCounter.toString();
};

function ProjectBoard() {
  const [selectedIdBubble, setSelectedIdBubble] = useState(null);
  const [dateModalOpened, setDateModalOpened] = useState(false);
  const [currentStartsDate, setCurrentStartsDate] = useState(null);
  const [currentEndsDate, setCurrentEndsDate] = useState(null);
  const [menuBubbleOptions, setMenuBubbleOptions] = useState(null);
  const bubbleRefs = useRef([]);
  const menuBubbleOptionsOpened = Boolean(menuBubbleOptions);

  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);

  const [layoutTimeline, setLayoutTimeline] = useState();
  const [layoutCustomPropsTimeline, setLayoutCustomPropsTimeline] = useState();

  const [selectedBubble, setSelectedBubble] = useState(null);

  const handleAddBubble = () => {
    const newItem = {
      w: 4,
      h: 2,
      x: 10,
      y: 5,
      i: getId(),
      minW: 4,
      maxW: 10,
      minH: 2,
      maxH: 5,
    };

    const newCustomProps = {
      bubbleId: newItem.i,
      title: "",
      color: "black",
      startsDate: null,
      endsDate: null,
      trace: false,
    };

    setLayout((prevLayout) => [...prevLayout, newItem]);
    setLayoutCustomProps((prevCustomProps) => [
      ...prevCustomProps,
      newCustomProps,
    ]);
    handleCloseMenuBubbleOptions();
  };

  const handleOpenMenuBubbleOptions = (event) => {
    setMenuBubbleOptions(event.currentTarget);
  };

  const handleCloseMenuBubbleOptions = () => {
    setMenuBubbleOptions(null);
  };

  const onBubbleDragStopTeste = (e) => {
    const layoutCopyTimeline = e.find((item) => item.y >= 26); //FOI PRA TIMELINE? (VALIDAR MELHOR) - // PEGA A UNICA BUBBLE QUE FOI PARA TIMELINE POIS SO PODE UMA POR VEZ

    if (!layoutCopyTimeline) return; // APENAS FOI ARRASTADA NO BOARD

    // Explicação da linha de cima (melhorar):
    // Ao fazer essa busca de bubbles que estão com o y >= 26, achamos a bubble que foi para a timeline caso houve
    // por que pegar o index 0? simples, porque não vamos ter mais bubbles nessa lista,
    // o máximo que ela vai trazer, vai ser uma, a mesma que foi movimentada para timeline
    // dessa forma, uma copia da bubble é criada na timeline e essa é apagada pois são dois layouts diferentes
    // (a timeline tem um layout próprio)

    setDateModalOpened(true);
    setSelectedIdBubble(layoutCopyTimeline.i);
  };

  const handleConfirmStartEndDate = () => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };

    if (currentStartsDate && currentEndsDate) {
      var diferencaEmMilissegundos = Math.abs(
        currentEndsDate - currentStartsDate
      );

      var diferencaEmDias = Math.ceil(
        diferencaEmMilissegundos / (1000 * 60 * 60 * 24) + 1
      );

      /////

      var dataInicial = new Date("2024-01-01");

      var diasComeco = Math.abs(currentStartsDate - dataInicial);

      var diasDif = Math.floor(diasComeco / (1000 * 60 * 60 * 24));

      /////

      var selectedBubbleCustomProps = layoutCustomProps.find(
        (x) => x.bubbleId === selectedIdBubble
      );

      const newItem = {
        x: diasDif,
        y: 0,
        w: diferencaEmDias,
        h: 1,
        i: getId(),
      };

      const newCustomProps = {
        bubbleId: newItem.i,
        title: selectedBubbleCustomProps.title,
        color: selectedBubbleCustomProps.color,
        startsDate: currentStartsDate,
        endsDate: currentEndsDate,
        trace: false,
      };

      setLayoutTimeline(newItem);
      setLayoutCustomPropsTimeline(newCustomProps);

      var selectedBubbleParaRastro = layout.find(
        (x) => x.i === selectedIdBubble
      );
      var selectedBubbleCustomPropsParaRastro = layoutCustomProps.find(
        (x) => x.bubbleId === selectedIdBubble
      );

      setLayout((prevLayout) =>
        prevLayout.filter((item) => item.i !== selectedIdBubble)
      );
      setLayoutCustomProps((prevLayout) =>
        prevLayout.filter((item) => item.bubbleId !== selectedIdBubble)
      );

      // --- Criação da bolha de rastro ---

      const newItemRastro = {
        w: selectedBubbleParaRastro.w,
        h: selectedBubbleParaRastro.h,
        x: 10,
        y: 5,
        i: selectedBubbleParaRastro.i,
        minW: selectedBubbleParaRastro.minW,
        maxW: selectedBubbleParaRastro.maxW,
        minH: selectedBubbleParaRastro.minH,
        maxH: selectedBubbleParaRastro.maxH,
      };

      const newCustomPropsRastro = {
        bubbleId: selectedBubbleParaRastro.i,
        title: selectedBubbleCustomPropsParaRastro.title,
        color: selectedBubbleCustomPropsParaRastro.color,
        startsDate: selectedBubbleCustomPropsParaRastro.startsDate,
        endsDate: selectedBubbleCustomPropsParaRastro.endsDate,
        trace: true,
      };

      setLayout((prevLayout) => [...prevLayout, newItemRastro]);
      setLayoutCustomProps((prevCustomProps) => [
        ...prevCustomProps,
        newCustomPropsRastro,
      ]);

      // --- Criação da bolha de rastro ---

      console.log(
        `Informações da bolha: ${JSON.stringify(
          newItem
        )}\nAtividade definida para começar ${new Date(
          currentStartsDate
        ).toLocaleDateString("pt-BR", options)} e terminar ${new Date(
          currentEndsDate
        ).toLocaleDateString("pt-BR", options)}`
      );

      setCurrentStartsDate(null);
      setCurrentEndsDate(null);
      //handleCloseStartEndDateModal();
      setDateModalOpened(false);
    }
  };

  const handleChangeColor = (id, color) => {
    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.bubbleId === id
          ? {
              ...prevBox,
              color: color.hex,
            }
          : prevBox
      )
    );
  };

  const handleChangeTitle = (id, content) => {
    setLayoutCustomProps((prevBubble) =>
      prevBubble.map((prevBox) =>
        prevBox.bubbleId === id
          ? {
              ...prevBox,
              title: content,
            }
          : prevBox
      )
    );
  };

  const handleCloseStartEndDateModal = (event, reason) => {
    if (!reason) {
      setDateModalOpened(false);
      return;
    }

    let startsDate = bubbles.find((x) => x.id === selectedIdBubble).startsDate;
    let endsDate = bubbles.find((x) => x.id === selectedIdBubble).endsDate;

    if (
      !startsDate ||
      isNaN(new Date(startsDate)) ||
      !endsDate ||
      isNaN(new Date(endsDate))
    ) {
      const bubbleIndex = bubbles.findIndex(
        (bubble) => bubble.id === selectedIdBubble
      );

      if (bubbleIndex !== -1) {
        const bubbleRef = bubbleRefs.current[bubbleIndex];
        if (bubbleRef && bubbleRef.current) {
          bubbleRef.current.updatePosition({
            x:
              bubbles.find((x) => x.id === selectedIdBubble).lastPositionX ??
              300,
            y:
              bubbles.find((x) => x.id === selectedIdBubble).lastPositionY ??
              20,
          });
        }
      }

      setBubbles((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === selectedIdBubble
            ? {
                ...box,
                x:
                  bubbles.find((x) => x.id === selectedIdBubble)
                    .lastPositionX ?? 300,
                y:
                  bubbles.find((x) => x.id === selectedIdBubble)
                    .lastPositionY ?? 20,
              }
            : box
        )
      );

      setCurrentStartsDate(null);
      setCurrentEndsDate(null);
    }

    setDateModalOpened(false);
  };

  const StartsEndDateModal = () => {
    return (
      <Modal
        keepMounted
        open={dateModalOpened}
        //onClose={handleCloseStartEndDateModal}
      >
        <Box sx={styles.dateModal}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={6} columns={16}>
              <Grid item xs={8}>
                <label
                  style={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  Data Início
                </label>
                <DatePicker
                  sx={{ marginTop: "5px" }}
                  slotProps={{ textField: { variant: "standard" } }}
                  format="DD/MM/YYYY"
                  value={currentStartsDate}
                  onChange={(value) => setCurrentStartsDate(value)}
                />
              </Grid>
              <Grid item xs={8}>
                <label style={{ fontSize: "15px", fontWeight: "500" }}>
                  Data Término
                </label>
                <DatePicker
                  sx={{ marginTop: "5px" }}
                  slotProps={{ textField: { variant: "standard" } }}
                  format="DD/MM/YYYY"
                  value={currentEndsDate}
                  onChange={(value) => setCurrentEndsDate(value)}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <ClassicButton
              onClick={handleConfirmStartEndDate}
              title="Confirmar"
            />
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <div style={styles.containerBoards}>
      <Navbar showMenu projectName="Projeto" />
      <div style={styles.topBoard}>
        <StartsEndDateModal />
        <IconButton
          style={styles.addBubble}
          onClick={handleOpenMenuBubbleOptions}
        >
          <AddIcon />
        </IconButton>
        <Menu
          anchorEl={menuBubbleOptions}
          open={menuBubbleOptionsOpened}
          onClose={handleCloseMenuBubbleOptions}
        >
          <MenuItem onClick={handleAddBubble}>Tarefa</MenuItem>
          <MenuItem onClick={handleAddBubble}>Player</MenuItem>
          <MenuItem onClick={handleAddBubble}>Link</MenuItem>
        </Menu>
        <BubbleTask
          layoutProps={layoutCustomProps}
          isHorizontal={false}
          stopBubble={false}
          layout={layout}
          setLayout={setLayout}
          onDragStop={onBubbleDragStopTeste}
          cols={50}
          onChangeColor={handleChangeColor}
          onChangeTitle={handleChangeTitle}
          onLayoutChange={(newLayout) => setLayout(newLayout)}
        />
      </div>
      <div id="timeline" style={styles.timeLine}>
        <Timeline
          layoutBubble={layoutTimeline}
          layoutBubbleProps={layoutCustomPropsTimeline}
        />
      </div>
    </div>
  );
}

export default ProjectBoard;
