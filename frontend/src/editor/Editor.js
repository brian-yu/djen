import React, { useState, useRef, useContext } from "react";
import styled from "styled-components";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

import AuthContext from "../auth/AuthContext";
import { sample } from "./sample";
import Viewer from "../viewer/Viewer";

function Editor() {

  const Tabs = Object.freeze({ JS: 1, HTML: 2, CSS: 3 });

  const [auth, setAuth] = useContext(AuthContext);
  const [tab, setTab] = useState(Tabs.JS);
  const [jsCode, setJSCode] = useState(sample);
  const [htmlCode, setHTMLCode] = useState("");
  const [cssCode, setCSSCode] = useState("");
  const iframe = useRef(null);

  const runScript = () => {
    // script.current.dangerouslySetInnerHTML
    // script.
    console.log(iframe.current);
    console.log(iframe.current.src);
  };

  const getCode = () => {
    switch (tab) {
      case Tabs.JS:
        return jsCode;
      case Tabs.HTML:
        return htmlCode;
      case Tabs.CSS:
        return cssCode;
    }
  };

  const setCode = (value) => {
    switch (tab) {
      case Tabs.JS:
        setJSCode(value);
        return;
      case Tabs.HTML:
        setHTMLCode(value);
        return;
      case Tabs.CSS:
        setCSSCode(value);
        return;
    }
  };

  const selectTab = (value) => {
    setTab(value);
  };

  const Tab = (props) => {
    return (
      <StyledTab
        selected={tab === props.value}
        onClick={() => selectTab(props.value)}
      >
        {props.children}
      </StyledTab>
    );
  };

  return (
    <Wrapper>
      <TabContainer>
        <Tab value={Tabs.JS}>js</Tab>
        <Tab value={Tabs.HTML}>html</Tab>
        <Tab value={Tabs.CSS}>css</Tab>
      </TabContainer>
      <Flex>
        <div>
          <StyledEditor
            mode="javascript"
            theme="github"
            name="blah2"
            onChange={setCode}
            value={getCode()}
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
            <button className="success" onClick={runScript}>
              Run / Save
            </button>
          </ButtonContainer>
        </div>
        <Viewer
          width="35vw"
          height="60vh"
          // src="http://localhost:8000/submissions/JvD5dc66VUWgJHctMD9Heh/render/"
          ref={iframe}
        ></Viewer>
      </Flex>
    </Wrapper>
  );
}

export default Editor;

const Wrapper = styled.div`
  width: 70vw;
`;

const StyledEditor = styled(AceEditor)`
  border-style: solid;
  border-width: 1px;
  border-color: black;
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

const TabContainer = styled.div`
  display: flex;
`;

const StyledTab = styled.div`
  padding: 2px;
  margin-bottom: 1px;
  margin-right: 1px;
  border-style: solid;
  border-width: 1px;
  border-color: black;

  background-color: ${(props) => (props.selected ? "#e4e4e5" : "inherit")};
  transform: ${(props) => (props.selected ? "translateY(1px)" : "none")};
  border-bottom-width: ${(props) => (props.selected ? "0px" : "1px")};

  :hover {
    transform: translateY(1px);
    cursor: pointer;
    border-bottom-width: 0px;
  }
`;
