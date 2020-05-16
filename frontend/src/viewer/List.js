import React, { useContext } from "react";
import styled from "styled-components";

import AuthContext from "../auth/AuthContext";
import Submission from "./Submission";

function List(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const list = props.list;

  return list.map((submission, idx) => {
    return (
      <Item key={submission.id}>
        <Submission submission={submission} idx={idx} />
      </Item>
    );
  });
}

export default List;

const Item = styled.div`
  margin: 50px 0px;
`;
