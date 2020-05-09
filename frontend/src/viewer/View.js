import React from "react";
import styled from "styled-components";

import Editor from "../editor/Editor";

function View() {
  return (
    <Wrapper>
      <Editor readOnly />
    </Wrapper>
  );
}

export default View;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
