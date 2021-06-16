import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import "./header.sass";
import { userActions } from "../../../_actions";
import Avatar from "react-avatar";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  componentDidMount() {}

  handleLogout() {
    return (e) => this.props.logout();
  }

  render() {
    const { authentication } = this.props;
    const { loggedIn, user } = authentication;

    return (
      <div>
        {loggedIn && (
          <nav className="navbar navbar-expand-lg navbar-light bg-indigo-900">
            <div className="container">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link to="/">
                      <button className="btn text-white font-bold bg-blue-800 hover:bg-indigo-500 hover:border hover:border-black">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width={2}
                            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                          />
                        </svg>
                        Boards
                      </button>
                    </Link>
                  </li>
                </ul>
                <div className="dropdown dropstart">
                  <a
                    className="nav-link"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <Avatar
                      className="d-flex"
                      name={user.email}
                      size="45px"
                      round="25px"
                      color="lightgray"
                      maxInitials={1}
                      fgColor="black"
                    />
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link
                        to="/login"
                        className="dropdown-item"
                        onClick={this.handleLogout()}
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    );
  }
}

function mapState(state) {
  const { authentication } = state;
  return { authentication };
}

const actionCreators = {
  logout: userActions.logout,
};

const connectedHeader = withRouter(connect(mapState, actionCreators)(Header));
export { connectedHeader as Header };
