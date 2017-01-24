const React = require('react');

const newWikode = require('../../store/actions').new;

const NewWikodeForm = () => {
  return (
    <form method="POST" action="/wikode/">
      <div>
        <label>Document title
          <input type="text" name="new-wikode-title" id="new-wikode-title" />
        </label>
      </div>
      <button className="button success" type="submit">Create</button>
    </form>
  );
};

module.exports = NewWikodeForm;
