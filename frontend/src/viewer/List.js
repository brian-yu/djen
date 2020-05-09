import React, { useContext } from "react";
import styled from "styled-components";
import TrackVisibility from "react-on-screen";

import AuthContext from "../auth/AuthContext";
import { API_HOST } from "../App";
import Viewer from "../viewer/Viewer";
import { Link } from "react-router-dom";

function List(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const list = props.list.reverse();

  return list.map((submission) => {
    return (
      <Item key={submission.id}>
        <h4>{submission.title}</h4>
        <p>
          by{" "}
          <Link to={`/profile/${submission.username}`}>
            {submission.username}
          </Link>
        </p>
        <TrackVisibility>
          <Viewer
            width="35vw"
            height="60vh"
            src={`${API_HOST}/submissions/${submission.id}/render/`}
            ref={submission.iframe}
          ></Viewer>
        </TrackVisibility>
      </Item>
    );
  });
}

export default List;

const Item = styled.div`
  margin: 50px 0px 100px 0px;
`;
