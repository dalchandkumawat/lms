import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom'
import './App.css';
import Navbar from './components/Navbar';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Overview from './components/Overview';
import Home from './components/Home';
import { reducer, initialState } from './reducers/userReducer';
import AddClass from './components/AddClass';
export const UserContext = createContext();
const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user })
      history.push('/');
    }
    else {
        history.push('/signin');
    }
  }, [])
  return (
    <Switch>
      <Route exact path='/'><Home></Home></Route>
      <Route path='/signin'><Signin></Signin></Route>
      <Route path='/signup'><Signup></Signup></Route>
      <Route path='/profile'><Profile></Profile></Route>
      <Route path='/overview'><Overview></Overview></Route>
      <Route path='/addclass'><AddClass></AddClass></Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar></Navbar>
          <Routing></Routing>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
