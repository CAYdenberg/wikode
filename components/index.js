const React = require('react');
const Provider = require('react-redux').Provider;

const Header = require('./Layout/Header');
const Footer = require('./Layout/Footer');

const Layout = (props) => {
  return (
    <Provider store={props.store}>
      <div>

        <Header />
        {props.children}
        <Footer />

      </div>
    </Provider>
  );
}

Layout.propTypes = {
  children: React.PropTypes.element.isRequired
}

const Routes = {
  Home: require('./Home'),
  Editor: require('./Editor')
}

module.exports = (routeName, store) => {
  const Route = Routes[routeName];
  return (
    <Layout store={store}>
      <Route />
    </Layout>
  );
}
