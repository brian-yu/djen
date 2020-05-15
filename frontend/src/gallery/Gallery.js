import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import AuthContext from "../auth/AuthContext";
import { API_HOST } from "../App";
import List from "../viewer/List";

const Orders = Object.freeze({
  HOT: {
    name: "hot",
    key: "hot",
  },
  NEW: {
    name: "new",
    key: "new",
  },
  TOP: {
    name: "top",
    key: "top",
  },
});

function Gallery(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const [list, setList] = useState(null);
  const [order, setOrder] = useState(Orders.HOT);

  useEffect(() => {
    const headers = auth ? { Authorization: `Token ${auth.token}` } : {};
    fetch(`${API_HOST}/submissions?ordering=${order.key}`, {
      method: "GET",
      headers: headers,
    })
      .then((resp) => {
        return resp.json();
      })
      .then((resp) => {
        setList(resp.results);
      });
  }, [order, auth]);

  if (!list) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h4>gallery</h4>
      <Nav>
        <NavItem
          selected={order === Orders.HOT}
          onClick={() => setOrder(Orders.HOT)}
        >
          <div>hot</div>
        </NavItem>
        <NavItem
          selected={order === Orders.NEW}
          onClick={() => setOrder(Orders.NEW)}
        >
          <div>new</div>
        </NavItem>
        <NavItem
          selected={order === Orders.TOP}
          onClick={() => setOrder(Orders.TOP)}
        >
          <div>top</div>
        </NavItem>
      </Nav>
      <List list={list}></List>
    </div>
  );
}

export default Gallery;

const Nav = styled.ul`
  display: flex;
  justify-content: center;
  list-style-type: none;
`;

const NavItem = styled.li`
  cursor: pointer;
  margin: 0px 10px;
  text-decoration: ${(props) => (props.selected ? "none" : "underline")};
`;
