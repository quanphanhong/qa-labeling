import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import MainPage from './view/main/main';
import QAList from './view/qaList/qaList';

import { registerAuthChangedEvent } from './services/auth'

registerAuthChangedEvent();

function PrivateRoute ({ component: Component, auth, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => auth === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

// For testing!
const userIsAvailable = () => true;

const App = () => (
  <Router>
    <Switch>
      <Route path="/login" component={ MainPage }/>
      <PrivateRoute exact path="/" component={ QAList } auth={userIsAvailable()} />
      <PrivateRoute path="/data" component={ QAList } auth={userIsAvailable()}/>
    </Switch>
  </Router>
);

render(<App />, document.getElementById('root'));