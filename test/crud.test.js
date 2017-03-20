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

const assert = require(`assert`);
const config = require(`./config`);
const utils = require(`nodejs-repo-tools`);

module.exports = (DATA_BACKEND) => {
  describe(`crud.js`, () => {
    let ORIG_DATA_BACKEND;

    before(() => {
      const appConfig = require(`../config`);
      ORIG_DATA_BACKEND = appConfig.get(`DATA_BACKEND`);
      appConfig.set(`DATA_BACKEND`, DATA_BACKEND);
    });

    describe(`/pages`, () => {
      let id;

      // setup a page
      before((done) => {
        utils.getRequest(config)
          .post(`/api/pages`)
          .send({ title: `my page` })
          .expect(200)
          .expect((response) => {
            id = response.body.id;
            assert.ok(response.body.id);
            assert.equal(response.body.title, `my page`);
          })
          .end(done);
      });

      it(`should show a list of pages`, (done) => {
        // Give Datastore time to become consistent
        setTimeout(() => {
          const expected = `<div class="media-body">`;
          utils.getRequest(config)
            .get(`/pages`)
            .expect(200)
            .expect((response) => {
              assert.equal(response.text.includes(expected), true);
            })
            .end(done);
        }, 2000);
      });

      it(`should handle error`, (done) => {
        utils.getRequest(config)
          .get(`/pages`)
          .query({ pageToken: `badrequest` })
          .expect(500)
          .end(done);
      });

      // delete the page
      after((done) => {
        if (id) {
          utils.getRequest(config)
            .delete(`/api/pages/${id}`)
            .expect(200)
            .end(done);
        } else {
          done();
        }
      });
    });

    describe(`/pages/add`, () => {
      let id;

      it(`should post to add page form`, (done) => {
        utils.getRequest(config)
          .post(`/pages/add`)
          .send(`title=my%20page`)
          .expect(302)
          .expect((response) => {
            const location = response.headers.location;
            const idPart = location.replace(`/pages/`, ``);
            if (require(`../config`).get(`DATA_BACKEND`) !== `mongodb`) {
              id = parseInt(idPart, 10);
            } else {
              id = idPart;
            }
            assert.equal(response.text.includes(`Redirecting to /pages/`), true);
          })
          .end(done);
      });

      it(`should show add page form`, (done) => {
        utils.getRequest(config)
          .get(`/pages/add`)
          .expect(200)
          .expect((response) => {
            assert.equal(response.text.includes(`Add page`), true);
          })
          .end(done);
      });

      // delete the page
      after((done) => {
        if (id) {
          utils.getRequest(config)
            .delete(`/api/pages/${id}`)
            .expect(200)
            .end(done);
        } else {
          done();
        }
      });
    });

    describe(`/pages/:page/edit & /pages/:page`, () => {
      let id;

      // setup a page
      before((done) => {
        utils.getRequest(config)
          .post(`/api/pages`)
          .send({ title: `my page` })
          .expect(200)
          .expect((response) => {
            id = response.body.id;
            assert.ok(response.body.id);
            assert.equal(response.body.title, `my page`);
          })
          .end(done);
      });

      it(`should update a page`, (done) => {
        const expected = `Redirecting to /pages/${id}`;
        utils.getRequest(config)
          .post(`/pages/${id}/edit`)
          .send(`title=my%20other%20page`)
          .expect(302)
          .expect((response) => {
            assert.equal(response.text.includes(expected), true);
          })
          .end(done);
      });

      it(`should show edit page form`, (done) => {
        const expected =
          `<input type="text" name="title" id="title" value="my other page" class="form-control">`;
        utils.getRequest(config)
          .get(`/pages/${id}/edit`)
          .expect(200)
          .expect((response) => {
            console.log('RT', response.text);
            console.log('expected', expected);
            assert.equal(response.text.includes(expected), true);
          })
          .end(done);
      });

      it(`should show a page`, (done) => {
        const expected = `<h4>my other page&nbsp;<small></small></h4>`;
        utils.getRequest(config)
          .get(`/pages/${id}`)
          .expect(200)
          .expect((response) => {
            assert.equal(response.text.includes(expected), true);
          })
          .end(done);
      });

      it(`should delete a page`, (done) => {
        const expected = `Redirecting to /pages`;
        utils.getRequest(config)
          .get(`/pages/${id}/delete`)
          .expect(302)
          .expect((response) => {
            id = undefined;
            assert.equal(response.text.includes(expected), true);
          })
          .end(done);
      });

      // clean up if necessary
      after((done) => {
        if (id) {
          utils.getRequest(config)
            .delete(`/api/pages/${id}`)
            .expect(200)
            .end(done);
        } else {
          done();
        }
      });
    });

    after(() => {
      require(`../config`).set(`DATA_BACKEND`, ORIG_DATA_BACKEND);
    });
  });
};
