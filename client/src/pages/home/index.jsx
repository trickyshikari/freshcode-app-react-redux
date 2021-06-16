import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { boardActions } from "../../_actions";

import "./home.sass";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      boards: {},
      loading: true,
      success: null,
    };

    this.handleCreateBoard = this.handleCreateBoard.bind(this);
  }

  componentDidMount() {
    this.props.getBoards().then(() => {
      const { boards, loading, success } = this.props.board;
      this.setState({
        ...this.state,
        boards: boards,
        loading: loading,
        success: success,
      });
    });
  }

  handleCreateBoard() {
    this.props.addBoard();
  }

  render() {
    const { loading, success, boards } = this.state;
    const { newBoard } = this.props.board;

    if (newBoard && newBoard.id) {
      return <Redirect to={`/board/${newBoard.id}`} />;
    }

    return (
      <div className="flex flex-col gap-2 w-3/4 m-auto h-screen">
        <div className="flex-col p-2">
          <h2 className="font-bold text-xl ">
            <svg
              className="h-6 w-6 icon "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Personal Boards
          </h2>
        </div>
        {loading && <em>Loading boards...</em>}
        {!success && !loading && (
          <span className="text-danger">Error loading boards!</span>
        )}
        {success && boards && (
          <div className="flex flex-row flex-wrap self-left gap-4 text-white font-bold">
            {boards.map((board) => (
              <Link to={"/board/" + board.id} key={board.id}>
                <div className="w-64 h-32 p-3 bg-blue-900  hover:bg-indigo-600">
                  <p className="">{board.title}</p>
                </div>
              </Link>
            ))}
            <a href="#">
              <div
                className="w-64 h-32 p-3 bg-gray-400 text-black  hover:bg-indigo-600"
                onClick={this.handleCreateBoard}
              >
                Create new board...
              </div>
            </a>
          </div>
        )}
      </div>
    );
  }
}

function mapState(state) {
  const { board, authentication } = state;
  const { user } = authentication;
  return { board, user };
}

const actionCreators = {
  getBoards: boardActions.getBoards,
  addBoard: boardActions.addBoard,
};

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };
