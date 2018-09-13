const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .first()
    .from('folders')
    .where('id', id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = req.body;

  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where('id', id)
    .update(updateObj)
    .returning('name')
    .then(results => {
      res.json(results[0]);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const newObj = req.body;

  // const newItem = { name };

  if (!newObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  // post
  knex
    .insert(newObj)
    .into('folders')
    .returning(['id', 'name'])
    .then(results => {
      res.json(results[0]);
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('folders')
    .where('id', id)
    .del()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;
