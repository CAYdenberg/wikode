const React = require('react');

const Modal = (props) => {
  return (
    <div className="reveal-overlay" aria-hidden={props.visible ? 'false' : 'true'} onClick={props.hide}>
      <div className="reveal" aria-hidden={props.visible ? 'false' : 'true'} onClick={e => e.stopPropagation()}>
        <h2>{props.title}</h2>
        <hr />
        {props.children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: React.PropTypes.string.isRequired,
  children: React.PropTypes.element.isRequired,
  visible: React.PropTypes.bool.isRequired,
  hide: React.PropTypes.func.isRequired
}

module.exports = Modal;
