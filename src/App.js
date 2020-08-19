import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Projects from "./components/Projects";
import AboutMeCard from "./components/AboutMeCard";
import TrainingSession from "./components/TrainingSession";

// import "App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/aboutme" component={AboutMeCard} />
          <Route path="/TrainingSession" component={TrainingSession} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;
