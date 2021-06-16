import { authHeader } from '../_helpers';

export const queueService = {
  add,
  edit,
  del
};

function add(params) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(params)
  };

  requestOptions.headers['Content-Type'] = 'application/json';

  return fetch('/api/queue/', requestOptions)
    .then(handleResponse)
    .then((response) => {
      return response.queue;
    });
}

function edit(params) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify({ queue: params })
  };

  requestOptions.headers['Content-Type'] = 'application/json';

  return fetch('/api/queue/', requestOptions)
    .then(handleResponse)
    .then((response) => {
      return response.queue;
    });
}

function del(params) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
    body: JSON.stringify(params)
  };

  requestOptions.headers['Content-Type'] = 'application/json';

  return fetch('/api/queue/', requestOptions)
    .then(handleResponse)
    .then((response) => {
      return response.queue;
    });
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        console.log(response);
      }

      const error = (data && data.error) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
