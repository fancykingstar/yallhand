const axios = require('axios');
const base = "https://api.quadrance-develop.fabtesting.com/"

export const api_get = (endpoint) => {
   return axios({method: "get", url: base + endpoint, auth: {
        username: 'quadrance',
        password: 'Quadrance2019!'
    }})
}

