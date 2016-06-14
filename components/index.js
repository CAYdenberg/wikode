const React = require('react');
const Provider = require('react-redux').Provider;

module.exports = (templateName, store) => {
  const templates = {
    Home: require('../components/Home'),
    Editor: require('../components/Editor')
  }

  const template = templates[templateName];

  return (
    <Provider store={store} template={template}>
      {React.createElement(template)}
    </Provider>
  );
}
