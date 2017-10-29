import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'

const createStore = () => {
  return new Vuex.Store({
    state,
    mutations
  })
}

export default createStore
