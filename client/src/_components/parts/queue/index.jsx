import React from "react";
import { connect } from "react-redux";
import { boardActions, queueActions } from "../../../_actions";
import { TaskCard } from "../task";

class Queue extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = this.props.queue;

    this.state = {
      ...this.state,
      editing: false,
      title: this.props.queue.title,
      position: this.props.index,
    };

    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeleteQueue = this.handleDeleteQueue.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.queue._id === nextProps.queue._id;
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleEdit(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      editing: true,
    });
  }

  handleDeleteQueue(e) {
    e.preventDefault();
    this.props
      .del({
        board: {
          id: this.props.board._id,
          queue: {
            id: this.props.queue._id,
          },
        },
      })
      .then(() => this.props.callback());
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      ...this.state,
      editing: false,
    });

    if (this.props.queue.title !== this.state.title) {
      this.props.edit(this.state);
    }
  }

  render() {
    const queue = this.state;

    return (
      <div className="flex flex-col w-72 h-48 mt-4 mr-4 p-3 bg-gray-300">
        {queue.editing ? (
          <div>
            <div className="input-group has-validation">
              <input
                type="text"
                className={
                  "form-control " +
                  (queue.editing && queue.title.length === 0
                    ? "is-invalid"
                    : "")
                }
                name="title"
                value={queue.title}
                onChange={this.handleChange}
                onBlur={this.handleSubmit}
              />
              <div className="invalid-feedback">No task title provided</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row justify-between">
            <h4 className="font-bold" onDoubleClick={this.handleEdit}>
              {queue.title}
            </h4>
            <div className="dropdown">
              <a
                className="nav-link p-0"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={this.handleDeleteQueue}
                  >
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
        {queue.tasks && queue.tasks.length > 0 && (
          <div className="flex flex-col mt-2">
            {queue.tasks.map((task, index) => (
              <TaskCard task={task} key={index} />
            ))}
          </div>
        )}

        <button className="btn btn-success" onClick={this.handleAddQueue}>
          Add
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  queue: state.queueList[ownProps.index],
  board: state.board,
});

const actionCreators = {
  edit: queueActions.edit,
  del: boardActions.deleteQueue,
};

const connectedQueue = connect(mapStateToProps, actionCreators)(Queue);
export { connectedQueue as Queue };
