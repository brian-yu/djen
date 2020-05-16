import React, { useContext } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import AuthContext from "../auth/AuthContext";
import Gallery from "../gallery/Gallery";

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
        <button className="warning" onClick={() => logout(setAuth)}>
          Log out.
        </button>
      </>
    );
  };

  let User = () => {
    return <h3>{user}</h3>;
  };

  if (auth && user === auth.github_id) {
    User = Self;
  }
  return (
    <>
      <h3>{user}</h3>
      {auth && user === auth.github_id ? (
        <button className="warning" onClick={() => logout(setAuth)}>
          Log out.
        </button>
      ) : null}
      <Gallery filter={{key: 'user', value: user}} />
    </>
  );
}

export default Profile;
