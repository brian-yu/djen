import React, { useRef, useContext, useReducer, useEffect } from "react";
import styled from "styled-components";
import AceEditor from "react-ace";
import { useParams, useHistory } from "react-router-dom";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

import AuthContext from "../auth/AuthContext";
import { API_HOST } from "../App";
import { sample } from "./sample";
import Viewer from "../viewer/Viewer";

const Tabs = Object.freeze({ JS: 1, HTML: 2, CSS: 3 });
const initialState = {
  tab: Tabs.JS,
  title: "untitled",
  [Tabs.JS]: {
    code: sample,
    cursor: { row: 0, col: 0 },
  },
  [Tabs.HTML]: {
    code: "",
    cursor: { row: 0, col: 0 },
  },
  [Tabs.CSS]: {
    code: "",
    cursor: { row: 0, col: 0 },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case `setCode`:
      return {
        ...state,
        [state.tab]: {
          ...state[state.tab],
          code: action.value,
        },
      };
    case "setCursor":
      return {
        ...state,
        [state.tab]: {
          ...state[state.tab],
          cursor: action.value,
        },
      };
    case "setTab":
      return {
        ...state,
        tab: action.value,
      };
    case "setTitle":
      return {
        ...state,
        title: action.value,
      };
    case "initCode":
      return {
        ...state,
        ...action.value,
      };
    case "reset":
      return initialState;
    default:
      throw new Error();
  }
}

function useCursor(editor, state) {
  useEffect(() => {
    if (!editor || !editor.current) {
      return;
    }
    const { row, column } = state[state.tab].cursor;
    editor.current.editor.gotoLine(row + 1, column);
  }, [state.tab]);
}

function useInitialState(id, dispatch, setTitle) {
  useEffect(() => {
    if (!id) {
      dispatch({ type: "reset" });
      return;
    }

    fetch(`${API_HOST}/submissions/${id}/`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: "setTitle", value: data.title });
        dispatch({
          type: "initCode",
          value: {
            [Tabs.JS]: {
              ...initialState[Tabs.JS],
              code: data.js,
            },
            [Tabs.HTML]: {
              ...initialState[Tabs.HTML],
              code: data.html,
            },
            [Tabs.CSS]: {
              ...initialState[Tabs.CSS],
              code: data.css,
            },
          },
        });
      });
  }, [id]);
}

function Editor() {
  const history = useHistory();
  const { id } = useParams();
  const [auth, _] = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  const iframe = useRef(null);
  const editor = useRef(null);

  useCursor(editor, state);
  useInitialState(id, dispatch);

  const runScript = () => {
    const method = !id ? "POST" : "PUT";
    const endpoint = !id
      ? `${API_HOST}/submissions/`
      : `${API_HOST}/submissions/${id}/`;
    fetch(endpoint, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${auth.token}`,
      },
      body: JSON.stringify({
        title: state.title,
        js: state[Tabs.JS].code,
        html: state[Tabs.HTML].code,
        css: state[Tabs.CSS].code,
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          console.error(resp);
          throw new Error("Error!");
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        if (method === "PUT") {
          iframe.current.src += "";
        } else {
          history.push(`/create/${data.id}`);
        }
      });
  };

  const Tab = (props) => {
    const click = () => {
      // Record current tab cursor position.
      if (editor && editor.current) {
        dispatch({
          type: "setCursor",
          value: editor.current.editor.getCursorPosition(),
        });
      }
      // Switch tabs.
      dispatch({ type: "setTab", value: props.value });
    };

    return (
      <StyledTab selected={state.tab === props.value} onClick={click}>
        {props.children}
      </StyledTab>
    );
  };

  return (
    <Wrapper>
      <TitleContainer>
        <Title>title:</Title>
        <TitleInput
          value={state.title}
          onChange={(e) =>
            dispatch({ type: "setTitle", value: e.target.value })
          }
        ></TitleInput>
      </TitleContainer>
      <TabContainer>
        <Tab value={Tabs.JS}>js</Tab>
        <Tab value={Tabs.HTML}>html</Tab>
        <Tab value={Tabs.CSS}>css</Tab>
      </TabContainer>
      <Flex>
        <div>
          <StyledEditor
            ref={editor}
            mode="javascript"
            theme="github"
            name="blah2"
            onChange={(code) => dispatch({ type: "setCode", value: code })}
            value={state[state.tab].code}
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
          src={id ? `${API_HOST}/submissions/${id}/render/` : null}
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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const TitleInput = styled.input`
  font-size: 1em;
  width: auto;
  margin: 0;
`;

const Title = styled.h4`
  margin: 0;
`;
