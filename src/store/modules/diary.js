const state = {
  uploadlist: [],
  mood: 'mood',
  weather: 'the weather'
}

const mutations = {
  refreshUploadlist (state, newurl) {
    state.uploadlist.push(newurl)
  },
  clearUploadlist (state) {
    state.uploadlist = []
  },
  changeMoodAndWeather (state, {mood, weather}) {
    state.mood = mood
    state.weather = weather
  }
}
const getters = {
  getUploadlist (state) {
    return state.uploadlist
  },
  mood (state) {
    return state.mood
  },
  weather (state) {
    return state.weather
  }
}
export default {
  state,
  getters,
  mutations
}
