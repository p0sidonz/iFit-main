/* eslint-disable */

  // This Contain Login and Singup!
  // Signup just push to home page nothing fancy
  // login will update token and isAuthenticated State
  // later will use isAuthenicated getter to manupulate links
  export default {
    state: {
       userInfo: JSON.parse( localStorage.getItem('userInfo') ),
        token:  JSON.parse( localStorage.getItem('apollo-token') ),
        isUserLoggedIn: !!localStorage.getItem('apollo-token')
        
      },
      getters: {
        userInfo: state => state.userInfo,
        isUserLoggedIn: state => state.isUserLoggedIn

      },

      mutations: {
        auth_success(state, response ) {
          state.isUserLoggedIn = true
          state.userInfo = response 
        },
      },

      actions:{
        loginState({commit}, response) {
          commit('auth_success', response)
        }

      }
}