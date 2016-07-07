const React = require('react');
const Provider = require('react-redux').Provider;

const Header = require('./layout/Header');
const Footer = require('./layout/Footer');

module.exports = (templateName, store) => {
  const templates = {
    Home: require('./Home'),
    Editor: require('./Editor')
  }

  const template = templates[templateName];

  return (
    <Provider store={store}>
      <div>

        <Header />
        {React.createElement(template)}
        <Footer />

      </div>
    </Provider>
  );
}
