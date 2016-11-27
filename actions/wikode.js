const popsicle = require('popsicle');
const update = require('react-addons-update');
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
    console.log(res.body);
    switch(res.status) {

      case 200:
        return {type: SAVE_WIKODE, datetime: res.body.wikode.datetime, user: res.body.wikode.user};

      default:
        return {type: SET_UI, el: 'save-btn', value: 'The document could not be saved'};

    }
  },

  save: function(wikode, content, user) {
    user = user || 'local';

    const newWikode = update(wikode, {$merge: {
      content: content,
      user: user
    }});

    return function(dispatch) {

      localStorage.setItem(newWikode.slug, JSON.stringify(newWikode));

      if (newWikode.user === 'local') {
        return;
      }

      popsicle.post({
        url: `/${newWikode.user}/${newWikode.slug}`,
        body: newWikode,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
