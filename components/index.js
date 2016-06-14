const React = require('react');
const Provider = require('react-redux').Provider;

module.exports = (templateName, store) => {
  const templates = {
    Home: require('./Home'),
    Editor: require('./Editor')
  }

  const template = templates[templateName];

  return (
    <Provider store={store}>
      {React.createElement(template)}
    </Provider>
  );
}
