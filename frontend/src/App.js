import React from 'react';
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

function githubOauthLink() {
  if (process.env.NODE_ENV !== 'production') {
    return "https://github.com/login/oauth/authorize?client_id=24972415ccb6750e9d2f";
  }
  return "https://github.com/login/oauth/authorize?client_id=c4331b3aa91bd50a453c";
}

function App() {
  return (
    <div className="App">
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
            <h1>djen</h1>
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;