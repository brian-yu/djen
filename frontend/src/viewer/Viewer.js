import React, { forwardRef } from "react";
import styled from "styled-components";

const Viewer = forwardRef((props, ref) => {
  return (
    <StyledIFrame
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      ref={ref}
      src={props.src}
      width={props.width}
      height={props.height}
    ></StyledIFrame>
  );
});

export default Viewer;

const StyledIFrame = styled.iframe`
  width: ${props => props.width};
  height: ${props => props.height};
  border-style: solid;
  border-width: 1px;
  border-color: black;
`;