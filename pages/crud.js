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

const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');

function getModel () {
  return require(`./model-${config.get('DATA_BACKEND')}`);
}

const router = express.Router();

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({ extended: false }));

// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

/**
 * GET /pages/add
 *
 * Display a page of pages (up to ten at a time).
 */
router.get('/', (req, res, next) => {
  getModel().list(10, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.render('admin/list.html', {
      pages: entities,
      nextPageToken: cursor
    });
  });
});

/**
 * GET /pages/add
 *
 * Display a form for creating a page.
 */
// [START add_get]
router.get('/add', (req, res) => {
  res.render('admin/form.html', {
    page: {},
    action: 'Add'
  });
});
// [END add_get]

/**
 * POST /pages/add
 *
 * Create a page.
 */
// [START add_post]
router.post('/add', (req, res, next) => {
  const data = req.body;

  // Save the data to the database.
  getModel().create(data, (err, savedData) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  });
});
// [END add_post]

/**
 * GET /pages/:id/edit
 *
 * Display a page for editing.
 */
router.get('/:page/edit', (req, res, next) => {
  getModel().read(req.params.page, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('admin/form.html', {
      page: entity,
      action: 'Edit'
    });
  });
});

/**
 * POST /pages/:id/edit
 *
 * Update a page.
 */
router.post('/:page/edit', (req, res, next) => {
  const data = req.body;

  getModel().update(req.params.page, data, (err, savedData) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  });
});

/**
 * GET /pages/:id
 *
 * Display a page.
 */
router.get('/:page', (req, res, next) => {
  getModel().read(req.params.page, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('admin/view.html', {
      page: entity
    });
  });
});

/**
 * GET /pages/:id/delete
 *
 * Delete a page.
 */
router.get('/:page/delete', (req, res, next) => {
  getModel().delete(req.params.page, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(req.baseUrl);
  });
});

/**
 * Errors on "/pages/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
