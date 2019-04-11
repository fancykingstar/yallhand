import { UIStore } from "../Stores/UIStore"
import { loadAdmin } from "./LoadProfile";
const api_url = "http://127.0.0.1:3000/"



export const getUser = () => {
  let user = localStorage.getItem('user')
  if (user) user = JSON.parse(user)
  return user
}

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
  loadAdmin()
}

export const deleteUser = (user) => {
  UIStore.toggleScreenLoading()
  localStorage.removeItem('user')
  window.location.href = '/'

}

export const getHeaders = () => {
  const user = getUser()
  return user ? {"Content-Type": "application/json", 'Authorization': user.token} : {"Content-Type": "application/json"}

}

export const apiCall = async (endpoint, method, data = {}) => {
  const headers = getHeaders()

  return fetch(api_url + endpoint, {
    method: method,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: headers,
    body: JSON.stringify(data)
  })
};

export const apiCall_noBody = async (endpoint, method) => {
  const headers = getHeaders()

  return fetch(api_url + endpoint, {
    method: method,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: headers
  }).then(response => response.json());
};

export const apiCall_del = async (endpoint, meth) => {
  const headers = getHeaders()

  return fetch(api_url + endpoint, {
    method: meth,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: headers
  })
};

export const apiCall_pixel = async (endpoint) => {
  return fetch(api_url + endpoint, {
    method: 'GET',
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: getHeaders()
  })
};
