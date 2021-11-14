import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import MainPage from './view/main/main';
import QAList from './view/qaList/qaList';

const App = () => (
  <Router>
    <Switch>
      <Route path="/login" component={ MainPage }/>
      <Route exact path="/" component={ QAList }/>
      <Route path="/data" component={ QAList }/>
    </Switch>
  </Router>
);

render(<App />, document.getElementById('root'));