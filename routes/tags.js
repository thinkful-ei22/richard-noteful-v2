'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');



// GET all
router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

// GET by id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  knex 
    .select('id', 'name')
    .from('tags')
    .where('tags.id', id)
    .then(results => {
      if (results[0]) {
        res.json(results[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE ITEM ========== */
router.post('/', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

// PUT
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const {name} = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = {name};

  knex
    .from('tags')
    .where('tags.id', id)
    .update(newItem)
    .returning(['id','name'])
    .then(results => {
      if (results[0]){
        res.json(results[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// DELETE

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  knex
    .from('tags')
    .where('tags.id', id)
    .del()
    .then(results => {
      if(results) {
        res.sendStatus(204);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

module.exports = router;