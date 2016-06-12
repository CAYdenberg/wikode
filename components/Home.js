const React = require('react');

const Header = require('./layout/Header');
const Footer = require('./layout/Footer');

module.exports = () => {
  return (
    <div>
      <Header />

      <div className="column row">
        <h1>Home/splash page</h1>
        <form action="." method="POST">
          <button type="submit" className="button primary">Create a new document</button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
