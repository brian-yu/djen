import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import shortid from "shortid";
import { useParams, useHistory } from "react-router-dom";

import AuthContext from "../auth/AuthContext";
import Editor from "../editor/Editor";

// function useID() {
//   const { id } = useParams();
//   const history = useHistory();
//   console.log(id);
//   useEffect(() => {
//     if (id) {
//       return;
//     }
//     history.push(`/create/${shortid.generate()}`);
//   });
//   return id;
// }

function Create() {
  // const id = useID();

  const [auth, setAuth] = useContext(AuthContext);

  // console.log(id);

  return (
    <Wrapper>
      <h4>make some cool ass art</h4>
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
