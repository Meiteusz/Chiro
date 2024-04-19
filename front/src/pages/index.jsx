"use client";

import React, { useState, useRef } from "react";
import "./styles.css";
import Navbar from "@/components/navbar";
import * as styles from "@/pages/project-board/styles";
import BubbleNew from "./bubbleNew";

const ProjectBoard = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Navbar projectName="Gerenciador de projetos" showMenu={true} />
        <div style={styles.topBoard}>
          <BubbleNew isHorizontal ={false} stopBubble={false}></BubbleNew>
        </div>    
      </div>    
  );
};

export default ProjectBoard;
