import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import AuthContext from "../auth/AuthContext";
import { API_HOST } from "../App";
import List from "../viewer/List";

function Gallery(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const [list, setList] = useState(null);

  useEffect(() => {
    if (list) {
      return;
    }
    fetch(`${API_HOST}/submissions`, {
      method: "GET",
    })
      .then((resp) => {
        return resp.json();
      })
      .then((resp) => {
        setList(resp);
      });
  }, [list]);

  if (!list) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h4>gallery</h4>
      <List list={list}></List>
    </div>
  );
}

export default Gallery;
