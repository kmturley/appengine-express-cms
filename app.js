// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const path = require('path');
const express = require('express');
const config = require('./config');
const nunjucks = require('nunjucks');
const nunjucksDateFilter = require('nunjucks-date-filter');

const app = express();
app.locals.date = new Date();
app.disable('etag');
const env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});
env.addFilter('date', nunjucksDateFilter);
app.set('trust proxy', true);

// Pages
app.use('/pages', require('./pages/templates'));
app.use('/admin', require('./pages/crud'));
app.use('/api/pages', require('./pages/api'));

// Redirect root to /pages
app.get('/', (req, res) => {
  res.redirect('/pages');
});

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res, next) => {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
  // Start the server
  const server = app.listen(config.get('PORT'), () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
