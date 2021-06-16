import { boardConstants } from '../_constants';

export function board(state = {}, action) {
  switch (action.type) {
    case boardConstants.GET_ALL_BOARDS_REQUEST:
      return {
        ...state.boards,
        loading: true
      };
    case boardConstants.GET_ALL_BOARDS_SUCCESS:
      return {
        loading: false,
        success: true,
        boards: action.boards
      };
    case boardConstants.GET_ALL_BOARDS_FAILURE:
      return {
        loading: false,
        success: false
      };
    case boardConstants.ADD_BOARD_REQUEST:
      return {
        ...state,
        newBoard: {
          loading: true
        }
      };
    case boardConstants.ADD_BOARD_SUCCESS:
      return {
        ...state,
        newBoard: {
          loading: false,
          id: action.id
        },
        redirect: {
          url: action.url
        }
      };
    case boardConstants.ADD_BOARD_FAILURE:
      return {
        ...state,
        newBoard: {
          loading: false,
          success: false
        }
      };
    case boardConstants.DELETE_BOARD_REQUEST:
      return {
        ...state,
        deleteBoard: {
          loading: true
        }
      };
    case boardConstants.DELETE_BOARD_SUCCESS:
      return {
        ...state,
        deleteBoard: {
          loading: false,
          success: true
        },
        redirect: action.url
      };
    case boardConstants.DELETE_BOARD_FAILURE:
      return {
        ...state,
        deleteBoard: {
          loading: false,
          success: false
        }
      };
    case boardConstants.GET_BOARD_REQUEST:
      return {
        loading: true
      };
    case boardConstants.GET_BOARD_SUCCESS:
      return action.board;
    case boardConstants.GET_BOARD_FAILURE:
      return {
        loading: false,
        success: false
      };
    case boardConstants.EDIT_BOARD_REQUEST:
      return {
        ...state,
        loading: true
      };
    case boardConstants.EDIT_BOARD_SUCCESS:
      return action.board;
    case boardConstants.EDIT_BOARD_FAILURE:
      return {
        ...state,
        loading: false,
        success: false
      };
    case boardConstants.DELETE_QUEUE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case boardConstants.DELETE_QUEUE_SUCCESS:
      return action.board;
    case boardConstants.DELETE_QUEUE_FAILURE:
      return {
        ...state,
        loading: false,
        success: false
      };
    default:
      return state;
  }
}
