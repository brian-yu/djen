import React, { useContext, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { API_HOST } from "../App";
import AuthContext from "./AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function useAuth(code) {
  const [_, setAuth] = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (!code) {
      return;
    }

    fetch(`${API_HOST}/api-token-auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response was not ok");
        }
        return resp.json();
      })
      .then((auth) => {
        setAuth(auth);
        localStorage.setItem("auth", JSON.stringify(auth));
        history.push(`/profile/${auth.github_id}`);
      });
  }, [code]);
}

function Callback() {
  const code = useQuery().get("code");
  useAuth(code);
  return (
    <>
      <h3>authenticating...</h3>
      <div className="spinner">
        <div className="cube1"></div>
        <div className="cube2"></div>
      </div>
    </>
  );
}

export default Callback;
