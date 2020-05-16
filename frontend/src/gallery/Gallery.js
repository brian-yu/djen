import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import AuthContext from "../auth/AuthContext";
import { API_HOST } from "../App";
import List from "../viewer/List";
import { useLocation, useParams, Redirect, Link } from "react-router-dom";

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

const OrderFromName = Object.freeze({
  [Orders.HOT.name]: Orders.HOT,
  [Orders.NEW.name]: Orders.NEW,
  [Orders.TOP.name]: Orders.TOP,
  null: Orders.HOT,
  undefined: Orders.HOT,
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Gallery({ title, filter }) {
  const [auth, setAuth] = useContext(AuthContext);
  const [list, setList] = useState(null);
  const order = OrderFromName[useParams().order];
  const page = useQuery().get("page");

  useEffect(() => {
    const filterStr = !!filter ? `&${filter.key}=${filter.value}` : "";
    const headers = auth ? { Authorization: `Token ${auth.token}` } : {};
    fetch(
      `${API_HOST}/submissions?ordering=${order.key}&page=${
        page ? page : 1
      }${filterStr}`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((resp) => {
        return resp.json();
      })
      .then((resp) => {
        setList(resp.results);
      });
  }, [order, auth]);

  if (!list) {
    return (
      <>
        <p>loading...</p>
        <div className="spinner">
          <div className="cube1"></div>
          <div className="cube2"></div>
        </div>
      </>
    );
  }

  return (
    <div>
      <h4>{title}</h4>
      <Nav>
        <NavItem selected={order === Orders.HOT} to={`./${Orders.HOT.name}`}>
          <div>hot</div>
        </NavItem>
        <NavItem selected={order === Orders.NEW} to={`./${Orders.NEW.name}`}>
          <div>new</div>
        </NavItem>
        <NavItem selected={order === Orders.TOP} to={`./${Orders.TOP.name}`}>
          <div>top</div>
        </NavItem>
      </Nav>
      <List list={list}></List>
      {/* TODO: add next and prev page */}
    </div>
  );
}

export default Gallery;

const Nav = styled.ul`
  display: flex;
  justify-content: center;
  list-style-type: none;
`;

const NavItem = styled(Link)`
  /* cursor: pointer; */
  margin: 0px 10px;
  text-decoration: ${(props) => (props.selected ? "none" : "underline")};
`;
