"use client";

import React, { useState, useRef } from "react";
import "./styles.css";
import Navbar from "@/components/navbar";
import * as styles from "@/pages/project-board/styles";
import BubbleNew from "./bubbleNew";

const ProjectBoard = () => {
  return (
    <div>
      <Navbar projectName="Gerenciador de projetos" />
      <BubbleNew isHorizontal={false} stopBubble={false}></BubbleNew>
    </div>
  );
};

export default ProjectBoard;
