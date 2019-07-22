import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'

const state = {
  sidebar: {
    need: true,
    visible: true,
    opened: Cookies.get('sidebarStatus')
      ? !!+Cookies.get('sidebarStatus')
      : true,
    withoutAnimation: false
  },
  navbar: {
    need: true,
    visible: true,
    withoutAnimation: false
  },
  tagsview: {
    need: false,
    visible: false,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: Cookies.get('size') || 'medium'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  HIDE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.visible = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  SHOW_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 1)
    state.sidebar.visible = true
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  HIDE_NAVBAR: (state, withoutAnimation) => {
    Cookies.set('navbarStatus', 0)
    state.navbar.visible = false
    state.navbar.withoutAnimation = withoutAnimation
  },
  SHOW_NAVBAR: (state, withoutAnimation) => {
    Cookies.set('navbarStatus', 1)
    state.navbar.visible = true
    state.navbar.withoutAnimation = withoutAnimation
  },
  HIDE_TAGSVIEW: (state, withoutAnimation) => {
    Cookies.set('tageviewStatus', 0)
    state.tagsview.visible = false
    state.tagsview.withoutAnimation = withoutAnimation
  },
  SHOW_TAGSVIES: (state, withoutAnimation) => {
    Cookies.set('tageviewStatus', 1)
    state.tagsview.visible = true
    state.tagsview.withoutAnimation = withoutAnimation
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  hideSideBar({ commit }, { withoutAnimation }) {
    commit('HIDE_SIDEBAR', withoutAnimation)
  },
  showSideBar({ commit }, { withoutAnimation }) {
    commit('SHOW_SIDEBAR', withoutAnimation)
  },
  hideNavBar({ commit }, { withoutAnimation }) {
    commit('HIDE_NAVBAR', withoutAnimation)
  },
  showNavBar({ commit }, { withoutAnimation }) {
    commit('SHOW_NAVBAR', withoutAnimation)
  },
  hideTagsView({ commit }, { withoutAnimation }) {
    commit('HIDE_TAGSVIEW', withoutAnimation)
  },
  showTagsView({ commit }, { withoutAnimation }) {
    commit('SHOW_TAGSVIES', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
