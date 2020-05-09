import React, { forwardRef, useState, useEffect } from "react";
import styled from "styled-components";

const Viewer = forwardRef((props, ref) => {

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (props.isVisible === undefined) {
      setIsVisible(true);
      return;
    }
    setIsVisible(props.isVisible);
  }, [props.isVisible]);

  return (
    <StyledIFrame
      sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      ref={ref}
      src={isVisible ? props.src : ""}
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