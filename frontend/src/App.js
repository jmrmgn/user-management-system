import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

// Layout
import { Navbar } from './layout';

// Components
import { Home, Users, Login, Signup } from './pages';

function App(props) {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
      </div>
    </Router>
  );
}

export default App;
