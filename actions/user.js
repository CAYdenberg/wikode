const popsicle = require('popsicle');

const {
  LOGIN,
  SET_UI
} = require('../store/constants');


const actions = module.exports = {

  loginResponse: function(res) {
    switch (res.status) {

      case 200:
        return {type: LOGIN, name: res.body.user};

      default:
        return {type: SET_UI, el: 'signinForm', value: 'Username or password is incorrect'}

    }
  },

  login: function(data) {
    return function(dispatch) {

      popsicle.request({
        method: 'POST',
        url: '/user/login/',
        body: data
      }).then(res => {
        dispatch(actions.loginResponse(res));
      });

    }
  },



  /**
   * CREATING A USER
   */

  createUserResponse: function(res) {

    switch (res.status) {

      case 200:
        return {type: LOGIN, name: res.body.user};

      case 400:
        return {type: SET_UI, el: 'createUserForm', value: res.body.error};

      default:
        return {type: SET_UI, el: 'createUserForm', value: 'User could not be created'}

    }
  },

  createUser: function(data) {
    return function(dispatch) {

      popsicle.request({
        method: 'POST',
        url: '/user/new/',
        body: data
      }).then(res => {
        dispatch(actions.createUserResponse(res));
      });

    }
  }

}
