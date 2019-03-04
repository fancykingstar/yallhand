// const api_url = "http://127.0.0.1:3000/";
const api_url = "https://api.quadrance-develop.fabtesting.com/"
// const api_url = "http://ec2-3-86-251-153.compute-1.amazonaws.com/"

export const apiCall = async (endpoint, method, data = {}) => {
  return fetch(api_url + endpoint, {
    method: method,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Basic cXVhZHJhbmNlOlF1YWRyYW5jZTIwMTkh'
    },
    body: JSON.stringify(data)
  })
};

export const apiCall_noBody = async (endpoint, method) => {
  return fetch(api_url + endpoint, {
    method: method,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Basic cXVhZHJhbmNlOlF1YWRyYW5jZTIwMTkh'
    }
  }).then(response => response.json());
};

export const apiCall_del = async (endpoint, meth) => {
  return fetch(api_url + endpoint, {
    method: meth,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    }
  })
};
