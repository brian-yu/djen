import React, { useContext } from "react";
import styled from "styled-components";

import AuthContext from "../auth/AuthContext";
import Editor from "../editor/Editor";

function Create() {

  const [auth, _] = useContext(AuthContext);

  if (!auth) {
    return (
      <h4>please sign in</h4>
    )
  }

  return (
    <Wrapper>
      <h4>make something cool</h4>
      <Editor />
    </Wrapper>
  );
}

export default Create;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
