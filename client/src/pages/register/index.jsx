import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { userActions } from "../../_actions";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: "",
        password: "",
      },
      submitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value,
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { user } = this.state;
    if (user.email && /.+@.+\..+/.test(user.email) && user.password) {
      this.props.register(user);
    }
  }

  render() {
    const { registering } = this.props;
    const { user, submitted } = this.state;
    const { email, password } = user;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign up
            </h2>
          </div>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <div className="input-group has-validation">
                  <input
                    type="text"
                    className={
                      "form-control appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm " +
                      (submitted && !/.+@.+\..+/.test(email)
                        ? "is-invalid"
                        : "")
                    }
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                    placeholder="Email address"
                  />
                  <div className="invalid-feedback">Invalid email</div>
                </div>
              </div>

              <div>
                <div className="input-group has-validation">
                  <input
                    type="password"
                    className={
                      "form-control appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm " +
                      (submitted && !password ? "is-invalid" : "")
                    }
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    placeholder="Password"
                  />
                  <div className="invalid-feedback">Password is required</div>
                </div>
              </div>

              <div>
                {registering ? (
                  <img src="" /> // TODO loading
                ) : (
                  <div className="flex gap-24">
                    <div className="flex-1">
                      <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign up
                      </button>
                    </div>
                    <div className="flex-1">
                      <Link
                        to="/login"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Back
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { registering } = state.registration;
  return { registering };
}

const actionCreators = {
  register: userActions.register,
};

const connectedRegisterPage = connect(mapState, actionCreators)(RegisterPage);
export { connectedRegisterPage as RegisterPage };
