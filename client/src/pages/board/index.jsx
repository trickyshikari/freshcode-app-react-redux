import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { boardActions, queueActions } from "../../_actions";
import { Queue } from "../../_components";

class BoardPage extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      board: {},
      newQueue: {
        title: "",
      },
    };

    this.props.initQueue([]);
    this.handleChange = this.handleNewQueueChange.bind(this);
    this.handleAddQueue = this.handleAddQueue.bind(this);
    this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTitleSubmit = this.handleTitleSubmit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.board._id === nextProps.board._id;
  }

  handleNewQueueChange(e) {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      newQueue: {
        [name]: value,
      },
    });
  }

  handleTitleChange(e) {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      board: {
        ...this.state.board,
        [name]: value,
      },
    });
  }

  async handleTitleSubmit(e) {
    e.preventDefault();

    if (this.state.board.title.length > 0) {
      await this.props
        .editBoard({
          board: {
            id: this.state.board._id,
            title: this.state.board.title,
          },
        })
        .then(() => {
          const { board } = this.props;
          this.setState({
            ...this.state,
            board: {
              ...this.state.board,
              editing: false,
            },
          });
          this.updateQueues();
        });
    }
  }

  onKeyDown(e) {
    if (e.key === "Enter") {
      this.handleTitleSubmit(e);
    }
  }

  async handleAddQueue(e) {
    e.preventDefault();

    await this.props
      .editBoard({
        board: {
          id: this.state.board._id,
          queue: {
            title: this.state.newQueue.title,
          },
        },
      })
      .then(() => {
        const { board } = this.props;
        this.setState({
          board: board,
          newQueue: {
            title: "",
          },
        });
        this.updateQueues();
      });
  }

  handleDeleteBoard(e) {
    e.preventDefault();

    this.props.deleteBoard({
      board: {
        id: this.state.board._id,
      },
    });
  }

  async componentDidMount() {
    const boardId = this.props.match.params.id;
    await this.props.getBoard(boardId).then(() => this.updateQueues());
  }

  componentWillUnmount() {
    this.props.initQueue([]);
  }

  updateQueues() {
    const { board } = this.props;
    console.log(board);
    this.setState({
      ...this.state,
      board: board,
    });
    this.props.initQueue(board.queues || []);
  }

  render() {
    const { board } = this.state;
    const { queueList } = this.props;
    const { newQueue } = this.state;
    const { redirect, success } = this.props.board;

    if (success === false || (redirect && redirect.length > 0)) {
      return <Redirect to={redirect} />;
    }

    return (
      <div className=" container flex flex-wrap flex-col gap-2 p-3 m-auto bg-blue-800 ">
        {board.loading && <em>Loading boards...</em>}
        {!board && <span className="text-danger">Error loading board!</span>}
        {board && queueList && (
          <div className="w-full">
            <div className="flex flex-row justify-between">
              {board.editing ? (
                <div className="has-validation ">
                  <input
                    className={
                      board.editing && board.title.length === 0
                        ? "is-invalid"
                        : ""
                    }
                    type="text"
                    name="title"
                    value={board.title}
                    placeholder="Board name"
                    onChange={this.handleTitleChange}
                    onBlur={this.handleTitleSubmit}
                    onKeyDown={this.handleKeyDown}
                  />
                  <div className="invalid-feedback">
                    No board title provided
                  </div>
                </div>
              ) : (
                <div
                  className="font-bold text-white "
                  onDoubleClick={() =>
                    this.setState({
                      ...this.state,
                      board: { ...this.state.board, editing: true },
                    })
                  }
                >
                  <h3>{this.state.board.title}</h3>
                </div>
              )}
              <div className="dropdown">
                <a
                  className="nav-link p-0 "
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round "
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
                      onClick={this.handleDeleteBoard}
                    >
                      Delete board
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="flex flex-nowrap w-min">
                {queueList.length > 0 &&
                  queueList.map((queue, index) => (
                    <Queue
                      queue={queue}
                      key={index}
                      index={index}
                      callback={() => {
                        this.updateQueues();
                      }}
                    />
                  ))}
                <div className="flex flex-col mt-4 mr-4 p-3  bg-gray-300 ">
                  <div className="input-group has-validation">
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={newQueue.title}
                      placeholder="Add a list..."
                      onChange={(e) => this.handleNewQueueChange(e, "newQueue")}
                    />
                  </div>
                  {newQueue.title.length > 0 && (
                    <div className="flex flex-row pt-3">
                      <button
                        className="btn btn-success"
                        onClick={this.handleAddQueue}
                      >
                        Add
                      </button>
                      <button
                        onClick={() =>
                          this.setState({
                            ...this.state,
                            newQueue: { title: "" },
                          })
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapState(state) {
  const { board, authentication, queueList } = state;
  const { user } = authentication;
  return { board, user, queueList };
}

const actionCreators = {
  getBoard: boardActions.getBoard,
  editBoard: boardActions.editBoard,
  deleteBoard: boardActions.deleteBoard,
  pushQueue: queueActions.push,
  popQueue: queueActions.pop,
  getQueue: queueActions.get,
  initQueue: queueActions.init,
};

const connectedBoardPage = connect(mapState, actionCreators)(BoardPage);
export { connectedBoardPage as BoardPage };
