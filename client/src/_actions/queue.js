import { queueConstants } from '../_constants';
import { queueService } from '../_services';

export const queueActions = {
  add,
  edit,
  del,
  push,
  pop,
  get,
  init
};

function add(params) {
  return (dispatch) => {
    dispatch(request());

    queueService.add(params).then(
      (queue) => {
        dispatch(success(queue));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: queueConstants.ADD_QUEUE_REQUEST };
  }

  function success(queue) {
    return { type: queueConstants.ADD_QUEUE_SUCCESS, queue };
  }

  function failure(error) {
    return { type: queueConstants.ADD_QUEUE_FAILURE, error };
  }
}

function edit(params) {
  return (dispatch) => {
    dispatch(request(params));

    queueService.edit(params).then(
      (queue) => {
        dispatch(success(queue));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request(queue) {
    return { type: queueConstants.EDIT_QUEUE_REQUEST, queue };
  }

  function success(queue) {
    return { type: queueConstants.EDIT_QUEUE_SUCCESS, queue };
  }

  function failure(error) {
    return { type: queueConstants.EDIT_QUEUE_FAILURE, error };
  }
}

function del(params) {
  return (dispatch) => {
    dispatch(request());

    queueService.del(params).then(
      (queue) => {
        dispatch(success(queue));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: queueConstants.DELETE_QUEUE_REQUEST };
  }

  function success(queue) {
    return { type: queueConstants.DELETE_QUEUE_SUCCESS, queue };
  }

  function failure(error) {
    return { type: queueConstants.DELETE_QUEUE_FAILURE, error };
  }
}

function push(queue) {
  return (dispatch) => {
    dispatch({
      type: queueConstants.ADD_QUEUE,
      queue: queue
    });
  };
}

function pop(queue) {
  return (dispatch) => {
    dispatch({
      type: queueConstants.DELETE_QUEUE,
      queue: queue
    });
  };
}

function get(index) {
  return (dispatch) => {
    dispatch({
      type: queueConstants.GET_QUEUE,
      index: index
    });
  };
}

function init(queues) {
  return (dispatch) => {
    dispatch({
      type: queueConstants.INIT_QUEUE,
      queues: queues
    });
  };
}
