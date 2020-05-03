import React, { useState } from "react";
import styled from 'styled-components';
import AceEditor from "react-ace";
import shortid from "shortid";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

import "./Editor.css";

function Editor() {
  const [id, setID] = useState(null);
  const [jsCode, setJSCode] = useState("console.log('whew')");

  console.log(shortid.generate())

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
          <button class="success">Run</button>
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
`