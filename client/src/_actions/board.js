import { boardConstants } from '../_constants';
import { boardService } from '../_services';

export const boardActions = {
  addBoard,
  deleteBoard,
  getBoards,
  getBoard,
  editBoard,
  deleteQueue
};

function addBoard() {
  return async (dispatch) => {
    dispatch(request());

    boardService.addBoard().then(
      (id) => {
        dispatch(success(id));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: boardConstants.ADD_BOARD_REQUEST };
  }

  function success(boardId) {
    return { type: boardConstants.ADD_BOARD_SUCCESS, id: boardId };
  }

  function failure(error) {
    return { type: boardConstants.ADD_BOARD_FAILURE, error };
  }
}

function deleteBoard(params) {
  return async (dispatch) => {
    dispatch(request(params));

    boardService.deleteBoard(params).then(
      (response) => {
        dispatch(success(response));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request(params) {
    return { type: boardConstants.DELETE_BOARD_REQUEST };
  }

  function success(response) {
    return { type: boardConstants.DELETE_BOARD_SUCCESS, url: '/' };
  }

  function failure(error) {
    return { type: boardConstants.DELETE_BOARD_FAILURE, error };
  }
}

function getBoards() {
  return async (dispatch) => {
    dispatch(request());

    await boardService.getBoards().then(
      (boards) => {
        dispatch(success(boards));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: boardConstants.GET_ALL_BOARDS_REQUEST };
  }

  function success(boards) {
    return { type: boardConstants.GET_ALL_BOARDS_SUCCESS, boards };
  }

  function failure(error) {
    return { type: boardConstants.GET_ALL_BOARDS_FAILURE, error };
  }
}

function getBoard(id) {
  return async (dispatch) => {
    dispatch(request());

    await boardService.getBoard(id).then(
      (board) => {
        dispatch(success(board));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: boardConstants.GET_BOARD_REQUEST };
  }

  function success(board) {
    return { type: boardConstants.GET_BOARD_SUCCESS, board };
  }

  function failure(error) {
    return { type: boardConstants.GET_BOARD_FAILURE, error };
  }
}

function editBoard(params) {
  return async (dispatch) => {
    dispatch(request());

    await boardService.editBoard(params).then(
      (board) => {
        dispatch(success(board));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: boardConstants.EDIT_BOARD_REQUEST };
  }

  function success(board) {
    return { type: boardConstants.EDIT_BOARD_SUCCESS, board };
  }

  function failure(error) {
    return { type: boardConstants.EDIT_BOARD_FAILURE, error };
  }
}

function deleteQueue(params) {
  return async (dispatch) => {
    dispatch(request());

    await boardService.deleteQueue(params).then(
      (board) => {
        dispatch(success(board));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: boardConstants.DELETE_QUEUE_REQUEST };
  }

  function success(board) {
    return { type: boardConstants.DELETE_QUEUE_SUCCESS, board };
  }

  function failure(error) {
    return { type: boardConstants.DELETE_QUEUE_FAILURE, error };
  }
}
