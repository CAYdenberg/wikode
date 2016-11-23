const popsicle = require('popsicle');
const {
  SET_UI,
  NEW_WIKODE,
  FORK_WIKODE,
  SAVE_WIKODE
} = require('../store/constants');

const {slugify} = require('../lib/');

const actions = module.exports = {

  /**
   *  SAVING A DOCUMENT
   */
  saveResponse: function(res) {
    switch(res.status) {

      case 200:
        return {type: SAVE_WIKODE, datetime: res.datetime};

      default:
        return {type: SET_UI, el: 'save-btn', value: 'The document could not be saved'};

    }
  },

  save: function(wikode, content) {
    console.log(content);
    return function(dispatch) {
      popsicle.request({
        method: 'POST',
        url: `/${wikode.user}/${wikode.slug}`,
        body: {
          title: wikode.title,
          slug: wikode.slug,
          content: content
        }
      }).then((res) => {
        dispatch(actions.saveResponse(res));
      });
    }
  },

  fork: function(user) {
    user = user || 'local';
    return {type: FORK_WIKODE, user: user};
  },

  new: function(title, user) {
    user = user || 'local';
    const slug = slugify(title);
    window.changeView('Editor');
    return {type: NEW_WIKODE, user: user, title: title, slug: slug}
  }

}
