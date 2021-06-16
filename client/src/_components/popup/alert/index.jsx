import React from 'react';
import { connect } from 'react-redux';
import { history } from '../../../_helpers';
import { alertActions } from '../../../_actions';

import './alert.sass';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    history.listen((location, action) => {
      // clear alert on location change
      this.props.clearAlerts();
    });
  }

  dismissHandler() {
    return (e) => this.props.clearAlerts();
  }

  render() {
    const { alert } = this.props;
    const statusStyle = alert.type
      ? alert.type === 'alert-danger'
        ? 'bg-red-100'
        : 'bg-green-100'
      : '';

    return (
      <div
        className={
          'alert flex fixed top-16 w-screen z-50 ' +
          (alert.message ? 'display: block' : 'display: none')
        }>
        {alert.message && (
          <div
            className={
              'text-center ' +
              statusStyle +
              ' p-8 m-auto rounded-xl border-2 border-black'
            }
            role="alert">
            <div>
              <strong className="alert-message font-bold">
                {alert.message}
              </strong>
            </div>
            <div className="w-0 h-0">
              <svg
                className="icon fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                onClick={this.dismissHandler()}>
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapState(state) {
  const { alert } = state;
  return { alert };
}

const actionCreators = {
  clearAlerts: alertActions.clear
};

const connectedAlert = connect(mapState, actionCreators)(Alert);
export { connectedAlert as Alert };
