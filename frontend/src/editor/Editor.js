import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import AceEditor from "react-ace";
import shortid from "shortid";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

import "./Editor.css";
import { useParams, useHistory } from "react-router-dom";

function useID() {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (id) {
      return;
    }
    history.push(`/create/${shortid.generate()}`);
  });
  return id;
}

function Editor() {
  const id = useID();
  const [jsCode, setJSCode] = useState("console.log('whew')");

  console.log(id)

  return (
    <>
      <h3>make some cool ass art</h3>
      <Wrapper>
        <div>
          <StyledEditor
            mode="javascript"
            theme="github"
            name="blah2"
            onChange={setJSCode}
            value={jsCode}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              useWorker: false,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
          <ButtonContainer>
            <button className="success">Run</button>
            <button className="warning">Save</button>
          </ButtonContainer>
        </div>
        <StyledIFrame sandbox="allow-scripts"></StyledIFrame>
      </Wrapper>
    </>
  );
}

export default Editor;

const StyledEditor = styled(AceEditor)`
  border-style: solid;
  border-width: 1px;
  border-color: black;
  width: 500px;
  height: 500px;
`;

const StyledIFrame = styled.iframe`
  width: 500px;
  height: 500px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;