const React = require('react');
const Provider = require('react-redux').Provider;

const Nav = require('./Nav');

const Routes = {
  Home: require('./Home'),
  Editor: require('./Editor'),
  Signin: require('./Signin'),
  NewWikode: require('./NewWikode')
}

module.exports = (routeName, store) => {
  const Route = Routes[routeName];
  return (
    <Provider store={store}>
      <div>
        <header>
          <Nav />
        </header>
        <Route />
      </div>
    </Provider>
  );
}
