import React, { useContext } from "react";
import styled from "styled-components";

import AuthContext from "../auth/AuthContext";
import Submission from "./Submission";

function List(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const list = props.list;

  return (
    <ul>
      {list.map((submission, idx) => {
        return (
          <Item key={submission.id}>
            <Submission submission={submission} idx={idx} />
          </Item>
        );
      })}
    </ul>
  );
}

export default List;

const Item = styled.li`
  margin: 50px 0px;

  &:first-child {
    margin: 20px 0px;
  }
`;
