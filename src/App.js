import React, { Fragment, Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/layout/About';
import axios from 'axios';
import GithubState from './context/github/GithubState';
import './App.css';

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  };

  getUserRepos = async (username) => {
    this.setState({ loading: true });

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&
      client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&
      client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    this.setState({ repos: res.data, loading: false });
  };

  setAlert = (message, type) => {
    this.setState({ alert: { message: message, type: type } });

    setTimeout(() => this.setState({ alert: null }), 5000);
  };

  render() {
    const { users, user, repos, loading } = this.state;
    return (
      <GithubState>
        <Router>
          <div className='App'>
            <Navbar />
            <div className='container'>
              <Alert alert={this.state.alert} />
              <Switch>
                <Route
                  exact
                  path='/'
                  render={(props) => (
                    <Fragment>
                      <Search setAlert={this.setAlert} />
                      <Users />
                    </Fragment>
                  )}
                />
                <Route exact path='/about' component={About} />
                <Route
                  exact
                  path='/user/:login'
                  render={(props) => (
                    <User
                      {...props}
                      getUserRepos={this.getUserRepos}
                      repos={repos}
                    />
                  )}
                />
              </Switch>
            </div>
          </div>
        </Router>
      </GithubState>
    );
  }
}

export default App;
