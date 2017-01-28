const React = require('react');

const BlockStyleControls = require('./BlockStyleControls');
const InlineStyleControls = require('./InlineStyleControls');

const {getCoords} = require('../../../../lib');

const Controls = React.createClass({
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

  controlsMount: function(domNode) {
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

      <div className="editor-controls" ref={this.controlsMount} style={this.state.fixed ? {position: "fixed", top: 0} : {position: "static"}}>
        <BlockStyleControls
          editorState={this.props.editorState}
          onToggle={this.props.toggleBlockType}
        />
        <InlineStyleControls
          editorState={this.props.editorState}
          onToggle={this.props.toggleInlineStyle}
        />
        <button onClick={this.props.save} className="editor-controls__save" aria-label="save">
          <span className="icon-save-cloud"></span>
        </button>
      </div>

    );
  }
});

module.exports = Controls;
