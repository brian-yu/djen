import React, { useContext } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import AuthContext from "../auth/AuthContext";

function logout(setAuth) {
  localStorage.removeItem("auth");
  setAuth(null);
}

function Profile() {
  const { user } = useParams();
  const [auth, setAuth] = useContext(AuthContext);

  const Self = () => {
    return (
      <>
        <h3>{user}</h3>
        <button className="warning" onClick={() => logout(setAuth)}>Log out.</button>
      </>
    )
  }

  const User = () => {
    return (
      <h3>{user}</h3>
    )
  }

  if (auth && user === auth.github_id) {
    return <Self />;
  }
  return <User />;
}

export default Profile;
