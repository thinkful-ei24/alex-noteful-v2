const express = require('express');
const knex = require('../knex');
const router = express.Router();

// GET all
router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//GET by ID
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .first()
    .from('tags')
    .where('id', id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// PUT
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  const newObj = req.body;

  if (!newObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('tags')
    .where('id', id)
    .update(newObj)
    .returning('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

//POST
router.post('/', (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex
    .insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then(results => {
      const result = results[0];
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => next(err));
});

//DELETE
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('tags')
    .where('id', id)
    .del()
    .returning(['name', 'id'])
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

module.exports = router;
