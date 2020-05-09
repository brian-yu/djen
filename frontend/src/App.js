import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import "./preface.min.css";

import AuthContext from "./auth/AuthContext";
import Callback from "./auth/Callback";
import Create from "./create/Create";
import Profile from "./profile/Profile";
import Gallery from "./gallery/Gallery";

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
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth) {
      setAuth(auth);
    }
  }, [setAuth]);
}

function App() {
  const [auth, setAuth] = useState(null);
  useLocalStorageAuth(setAuth);

  const SignInLink = () => {
    if (!auth) {
      return (
        <a href={githubOauthLink()}>sign in</a>
      );
    } else {
      return (
        <Link to={`/profile/${auth.github_id}`}>{auth.github_id}</Link>
      )
    }
  }

  return (
    <div className="App">
      <AuthContext.Provider value={[auth, setAuth]}>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">gallery</Link>
                </li>
                <li>
                  <Link to="/create">create</Link>
                </li>
                <li>
                  <Link to="/about">about</Link>
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
              <Route path="/about">
                <p>come back later.</p>
              </Route>
              <Route path="/auth/callback">
                <Callback />
              </Route>
              <Route path="/profile/:user">
                <Profile />
              </Route>
              <Route path="/">
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
