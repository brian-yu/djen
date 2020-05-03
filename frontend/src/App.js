import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import styled from 'styled-components';

import './App.css';
import './preface.min.css';

import Editor from './editor/Editor.js';

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
              <Link to="/login">sign in</Link>
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