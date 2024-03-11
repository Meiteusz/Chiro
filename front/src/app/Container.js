import React, { useCallback, useState } from 'react';

import { Box } from '../components/Box';
import { ItemTypes } from './ItemTypes';

const styles = {
  width: '100%',
  height: 600,
  border: '1px solid white',
  position: 'relative',
};

export const Container = ({ boxes, setBoxes }) => {

  return (
    <div style={styles}>
      {Object.keys(boxes).map((key) => {
        const { left, top, width, height, title } = boxes[key];
        return (
          <Box key={key} id={key} left={left} top={top}>
            {title}
          </Box>
        );
      })}
    </div>
  );
};
