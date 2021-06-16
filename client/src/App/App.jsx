import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { Footer, Header } from "../_components";

import { PrivateRoute } from "../_components";
import { HomePage } from "../pages/home";
import { LoginPage } from "../pages/login";
import { RegisterPage } from "../pages/register";
import { BoardPage } from "../pages/board";
import { Alert } from "../_components/popup";

export class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="page">
        <Alert />
        <div className="flex flex-col h-screen justify-between gap-4">
          <header>
            <Header />
          </header>
          <div className="h-screen items-center justify-center ">
            <Switch>
              <PrivateRoute exact path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <PrivateRoute path="/board/:id" component={BoardPage} />
              <Redirect from="*" to="/" />
            </Switch>
          </div>
          <footer>
            <Footer />
          </footer>
        </div>
      </div>
    );
  }
}
