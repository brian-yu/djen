import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  Redirect,
} from "react-router-dom";
import styled from "styled-components";

import "./App.css";
import "./preface.min.css";

import AuthContext from "./auth/AuthContext";
import Callback from "./auth/Callback";
import Create from "./create/Create";
import Profile from "./profile/Profile";
import Gallery from "./gallery/Gallery";
import About from "./About";
import View from "./viewer/View";

export const API_HOST =
  process.env.NODE_ENV !== "production"
    ? "http://127.0.0.1:8000"
    : "https://api.djen.xyz";

function githubOauthLink() {
  const env = process.env.NODE_ENV;
  const clientID =
    env !== "production" ? "24972415ccb6750e9d2f" : "c4331b3aa91bd50a453c";
  return `https://github.com/login/oauth/authorize?client_id=${clientID}`;
}

function useLocalStorageAuth(setAuth) {
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      setAuth(auth);
    }
  }, [setAuth]);
}

function NavLink({ children, to, activeOnlyWhenExact }) {
  const match = useRouteMatch({ path: to, exact: activeOnlyWhenExact });
  return (
    <StyledNavLink to={to} match={match}>
      {children}
    </StyledNavLink>
  );
}

function App() {
  const [auth, setAuth] = useState(null);
  useLocalStorageAuth(setAuth);

  const SignInLink = () => {
    if (!auth) {
      return <a href={githubOauthLink()}>sign in</a>;
    } else {
      return (
        <NavLink to={`/profile/${auth.github_id}/`}>{auth.github_id}</NavLink>
      );
    }
  };

  return (
    <div className="App">
      <AuthContext.Provider value={[auth, setAuth]}>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <NavLink to="/" activeOnlyWhenExact>
                    gallery
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/create">create</NavLink>
                </li>
                <li>
                  <NavLink to="/about">about</NavLink>
                </li>
                <li>
                  <SignInLink />
                </li>
              </ul>
            </nav>
            <h3>djen</h3>
            <Switch>
              <Route path="/create/:id?">
                <Create />
              </Route>
              <Route path="/view/:id">
                <View />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/auth/callback">
                <Callback />
              </Route>
              <Route path="/profile/:user/:order?">
                <Profile />
              </Route>
              <Route path="/:order?">
                <Gallery />
              </Route>
            </Switch>
          </div>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

const StyledNavLink = styled(Link)`
  text-decoration: ${(props) => (props.match ? "none" : "underline")};
`;
