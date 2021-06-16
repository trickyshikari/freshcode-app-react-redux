import { queueConstants } from '../_constants';

export function queue(state = {}, action) {
  switch (action.type) {
    case queueConstants.EDIT_QUEUE_REQUEST:
      return {
        ...state,
        processing: true
      };
    case queueConstants.EDIT_QUEUE_SUCCESS:
      return {
        ...state,
        ...action.queue
      };
    case queueConstants.EDIT_QUEUE_FAILURE:
      return {
        ...state,
        processing: false,
        success: false
      };
    default:
      return state;
  }
}

export function queueList(state = [], action) {
  const list = state.length > 0 ? [...state] : [];
  console.log(list);
  switch (action.type) {
    case queueConstants.INIT_QUEUE:
      return action.queues;
    case queueConstants.GET_QUEUE:
      return state[action.position];
    case queueConstants.ADD_QUEUE:
      list.push(queue(action.queue, action));
      return list;
    case queueConstants.DELETE_QUEUE:
      return [
        ...list.slice(0, action.position),
        ...list.slice(action.position + 1)
      ];
    case queueConstants.EDIT_QUEUELIST_REQUEST:
    case queueConstants.EDIT_QUEUELIST_SUCCESS:
    case queueConstants.EDIT_QUEUELIST_FAILURE:
      return [
        ...list.slice(0, action.queue.position),
        queue(action.queue, action),
        ...list.slice(action.queue.position + 1)
      ];
    default:
      return state;
  }
}
