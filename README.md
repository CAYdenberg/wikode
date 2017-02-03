# Wikode #

The forkable Wiki.

## Setting up a development environment ##

### Requirements ###

<table>
  <thead>
    <tr><th>Prerequisite</th><th>Version</th><th>How to Install</th></tr>
  </thead>
  <tbody>
    <tr><td>Nodejs</td><td>6.2.2</td><td><a href="https://nodejs.org/">Nodejs.org</a></td></tr>
    <tr><td>NPM</td><td>3.9.5</td><td>Should be installed along with Node</td></tr>
    <tr><td>Gulp</td><td>&3.9.0</td><td>npm install -g gulp</td></tr>
    <tr><td>MongoDB</td><td>3.0.7</td><td><a href="https://www.mongodb.org/">MongoDB.org</a></td></tr>
  </tbody>
</table>

### Directions ###

1. Install dependencies above.

1. `git clone https://github.com/CAYdenberg/wikode.git` and then `cd wikode`

1. `npm install`

1. Create a database and run MongoDB server. One way to do this is to create a directory in the project folder called `data`, and run `mongod --dbpath full/path/to/data/folder`.

1. `cp .env_example .env`

1. Open .env in a text editor. Enter a port (usually 3000) and leave env as `development`. Enter a random secret key (I use one from https://api.wordpress.org/secret-key/1.1/salt/) and your Mongo connection information (e.g. `localhost:27017/data`).

1. Run `gulp` to build resources.

1. Run `npm start`, open a browser and go to `http://localhost/3000` or whatever port you used above.

1. To begin development with watch and automatic reloading, run `gulp watch`. A new browser tab should open at `localhost:3001`.
