import React, { forwardRef, useState, useEffect } from "react";
import styled from "styled-components";

const Frame = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(props.idx === 0);
  useEffect(() => {
    // Render by default if no index or first in list.
    if (props.idx === 0 || props.idx === undefined) {
      setIsVisible(true);
      return;
    }
    setIsVisible(props.isVisible);
  }, [props.isVisible, props.idx]);

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

export default Frame;

const StyledIFrame = styled.iframe`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-style: solid;
  border-width: 1px;
  border-color: black;
`;
