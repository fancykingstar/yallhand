// const api_url = "http://127.0.0.1:3000/";
const api_url = "http://ec2-3-86-251-153.compute-1.amazonaws.com/"

export const apiCall = async (endpoint, meth, payload = {}) => {
  return fetch(api_url + endpoint, {
    method: meth,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
};

export const apiCall_noBody = async (endpoint, meth) => {
  return fetch(api_url + endpoint, {
    method: meth,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
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
