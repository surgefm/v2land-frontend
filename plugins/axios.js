import Cookie from 'cookie'
import Axios from 'axios'
import config from '~/const'

let headers = {}

try {
  let cookies = Cookie.parse(document.cookie)
  headers.Authorization = cookies.accessToken
} catch (err) {}

let instance = Axios.create({
  baseURL: config.api,
  timeout: 1000,
  headers
})

export default instance
