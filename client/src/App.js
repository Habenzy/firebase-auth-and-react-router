import { useState, useEffect } from "react";
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  Link
} from "react-router-dom";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const fireBaseConfigObj = undefined // replace undefined with your own firebase config

if (firebase.apps.length === 0) {
  firebase.initializeApp(fireBaseConfigObj);
}
function App() {
  //track signed in user
  const [user, setUser] = useState(null);
  //track form submission
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //Redirect by pushing to history obj
  let history = useHistory();

  //Handle email input
  function emailChangeHandler(evt) {
    setEmail(evt.target.value);
  }

  //handle password input
  function passwordChange(evt) {
    setPassword(evt.target.value);
  }

  //handle form submission
  async function login(evt) {
    evt.preventDefault();

    //authenticate with firebase, and store user object in a variable
    const userObj = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        //if the auth fails, print error message in console (prevents site from crashing on failed login)
        console.log(err.message);
      });

    // after login, store user object in state
    setUser(userObj);

    //redirect to the dashboard route
    history.push("/dashboard");
  }
  console.log("in main App component, user is:", user);

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(props) => {
          return (
            <Home
              user={user}
              login={login}
              emailChangeHandler={emailChangeHandler}
              passwordChange={passwordChange}
              email={email}
              password={password}
            />
          );
        }}
      />

      <Route
        path="/dashboard"
        render={(props) => {
          return <Dashboard user={user} />;
        }}
      />
    </Switch>
  );
}

function Home(props) {
  console.log("from Home Component user is:", props.user);
  return (
    <div>
      <h2>Please sign in or:</h2>
      {/*If user is already signed in clicking the link will bring them to the dashboard*/}
      <Link to='/dashboard'>Go to your dashboard</Link>

      <form onSubmit={props.login}>
        <input
          type="email"
          onChange={props.emailChangeHandler}
          value={props.email}
        />
        <input
          type="password"
          onChange={props.passwordChange}
          value={props.password}
        />
        <input type="submit" />
      </form>
    </div>
  );
}

function Dashboard(props) {
  console.log("from Dashboard, user is:", props.user);
  //If there is a user show the dashboard, otherwise send them back to the homepage (and clear state)
  return props.user ? <h1>Welcome back!</h1> : <Redirect to="/" />;
}

export default App;
