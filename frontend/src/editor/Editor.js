import React, {
  useRef,
  useContext,
  useReducer,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import styled from "styled-components";
import AceEditor from "react-ace";
import { useParams, useHistory, Link } from "react-router-dom";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

import AuthContext from "../auth/AuthContext";
import { API_HOST } from "../App";
import { sample } from "./sample";
import Frame from "../viewer/Frame";
import { Like } from "../viewer/Submission";

const Tabs = Object.freeze({ JS: 1, HTML: 2, CSS: 3 });

const BREAKPOINT = 992;

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
  username: null,
  upvote_count: null,
  id: null,
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
    case "load":
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
        dispatch({
          type: "load",
          value: {
            title: data.title,
            id: id,
            username: data.username,
            upvote_count: data.upvote_count,
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

export function useWindowSize() {
  const [size, setSize] = useState([null, null]);
  useLayoutEffect(() => {
    function updateSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < BREAKPOINT) {
        setSize([width - 100, height - 200]);
      } else {
        setSize([null, null]);
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

function Editor({ readOnly = false }) {
  const history = useHistory();
  const { id } = useParams();
  const [auth, _] = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [width, height] = useWindowSize();

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
        {readOnly ? (
          <div>
            <Title>{state.title}</Title>
            <p>
              by <Link to={`/profile/${state.username}`}>{state.username}</Link>
            </p>
            {auth && auth.github_id === state.username ? (
              <>
                <Link to={`/create/${id}`}>
                  <i className="fas fa-pencil-alt"></i>
                </Link>
                &nbsp;
                <Link to={`/create/${id}`}>edit</Link>
              </>
            ) : null}
          </div>
        ) : (
          <>
            <Title>title:</Title>
            <TitleInput
              value={state.title}
              onChange={(e) =>
                dispatch({ type: "setTitle", value: e.target.value })
              }
            ></TitleInput>
          </>
        )}
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
            width={width ? width : "35vw"}
            height={height ? height : "60vh"}
            showGutter={true}
            highlightActiveLine={true}
            readOnly={readOnly}
            setOptions={{
              useWorker: false,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
          {!readOnly ? (
            <ButtonContainer>
              <button className="success" onClick={runScript}>
                Run / Save
              </button>
            </ButtonContainer>
          ) : null}
        </div>
        <Frame
          width={width ? width : "35vw"}
          height={width ? width : "60vh"}
          src={id ? `${API_HOST}/submissions/${id}/render/` : null}
          ref={iframe}
        ></Frame>
      </Flex>
      <Like submission={state}></Like>
    </Wrapper>
  );
}

export default Editor;

const Wrapper = styled.div`
  @media (min-width: ${BREAKPOINT}px) {
    width: 70vw;
  }
`;

const StyledEditor = styled(AceEditor)`
  border-style: solid;
  border-width: 1px;
  border-color: black;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;

  @media (min-width: ${BREAKPOINT}px) {
    flex-direction: row;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media (min-width: ${BREAKPOINT}px) {
    justify-content: flex-start;
  }
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
  justify-content: center;
  margin: 20px 0;
`;

const TitleInput = styled.input`
  font-size: 1em;
  width: 300px;
  margin: 0 10px;
`;

const Title = styled.h4`
  margin: 0;
`;
