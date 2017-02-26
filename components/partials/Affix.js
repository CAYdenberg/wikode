const React = require('react');

function getCoords(elem) {
  if (!window || !document) {
    return;
  }
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top  = box.top +  scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}

const Affix = React.createClass({
  getInitialState: function() {
    return ({
      fixed: false
    });
  },

  offsetTop: null,

  handleScroll: function() {
    this.setState({
      fixed: (this.offsetTop < window.scrollY)
    });
  },

  onDivMount: function(domNode) {
    if (window) {
      this.offsetTop = getCoords(domNode).top;
      window.addEventListener('scroll', this.handleScroll);
    }
  },

  componentWillUnmount: function() {
    if (window) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  },

  render: function() {
    return (

      <div
        ref={this.onDivMount}
        style={this.state.fixed ?
          {position: 'fixed', top: 0} : {position: 'static'}}
        >
        {this.props.children}
      </div>

    );
  }
});

module.exports = Affix;
