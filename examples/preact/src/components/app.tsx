import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import Home from "../routes/home";
import NotFoundPage from "../routes/notfound";
import Profile from "../routes/profile";
import Header from "./header";

const App: FunctionalComponent = () => {
  return (
    <div id="preact_root">
      <Header />
      <Router>
        <Route path="/" component={Home} />
        <Route path="/profile/" component={Profile} user="me" />
        <Route path="/profile/:user" component={Profile} />
        <NotFoundPage default />
      </Router>
    </div>
  );
};

export default App;
