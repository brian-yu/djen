import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import './preface.min.css';

import Editor from './editor/Editor.js';
import Callback from './auth/Callback.js';
import AuthContext from './context/AuthContext.js';

function githubOauthLink() {
  const env = process.env.NODE_ENV;
  const clientID = env !== 'production' ? "24972415ccb6750e9d2f" : "c4331b3aa91bd50a453c";
  return `https://github.com/login/oauth/authorize?client_id=${clientID}`;
}

function App() {

  const [auth, setAuth] = useState(null);

  return (
    <div className="App">
      <AuthContext.Provider value={[auth, setAuth]}>
        <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">home</Link>
              </li>
              <li>
                <Link to="/create">create</Link>
              </li>
              <li>
                <Link to="/about">about</Link>
              </li>
              <li>
                <a href={githubOauthLink()}>sign in</a>
              </li>
            </ul>
          </nav>
          <h3>djen</h3>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/create/:id?">
              <Editor />
            </Route>
            <Route path="/about">
              <p>come back later.</p>
            </Route>
            <Route path="/auth/callback">
              <Callback />
            </Route>
            <Route path="/">
              <h4>gallery</h4>
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
    </div>
  );
}

export default App;