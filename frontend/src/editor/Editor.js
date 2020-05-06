import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import AceEditor from "react-ace";
import shortid from "shortid";
import { useParams, useHistory } from "react-router-dom";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

import { sample } from './sample.js';

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
  const [jsCode, setJSCode] = useState(sample);
  const iframe = useRef(null);
  const script = useRef(null);

  console.log(id)

  const runScript = () => {
    // script.current.dangerouslySetInnerHTML
    // script.
    console.log(iframe.current)
    console.log(iframe.src)
  }

  return (
    <Wrapper>
      <h4>make some cool ass art</h4>
      <Flex>
        <div>
          <StyledEditor
            mode="javascript"
            theme="github"
            name="blah2"
            onChange={setJSCode}
            value={jsCode}
            fontSize={14}
            showPrintMargin={true}
            width="35vw"
            height="60vh"
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
            <button className="success" onClick={runScript}>Run</button>
            <button className="warning">Save</button>
          </ButtonContainer>
        </div>
        <StyledIFrame
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          ref={iframe}
          // src={process.env.PUBLIC_URL + '/sandbox.html'}
          src="http://localhost:8000/submissions/JvD5dc66VUWgJHctMD9Heh/render/"
        >
        </StyledIFrame>
      </Flex>
    </Wrapper>
  );
}

export default Editor;

const StyledEditor = styled(AceEditor)`
  border-style: solid;
  border-width: 1px;
  border-color: black;
`;

const StyledIFrame = styled.iframe`
  width: 35vw;
  height: 60vh;
  border-style: solid;
  border-width: 1px;
  border-color: black;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;