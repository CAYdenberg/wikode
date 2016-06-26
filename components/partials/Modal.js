const React = require('react');

const Modal = (props) => {

  return (
    <div className="reveal" aria-hidden={props.visible ? 'false' : 'true'}>
      <h2>{props.title}</h2>
      <hr />
      {props.children}
    </div>
  );
};

Modal.propTypes = {
  title: React.PropTypes.string.isRequired,
  children: React.PropTypes.element.isRequired,
  visible: React.PropTypes.bool
}

module.exports = Modal;
