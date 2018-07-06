'use strict';

const express = require('express');
const router = express.Router();

const knex = require('../knex');

// Get All Folders (no search filter needed)
router.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

// Get Folder by id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  knex
    .select('id','name')
    .from('folders')
    .modify(queryBuilder => {
      queryBuilder.where('folders.id', id);
    })
    .then(results => {
      if (results[0]) {
        res.json(results[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// Update Folder The noteful app does not use this endpoint but we'll create it in order to round out our API
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  const {name} =  req.body;
  const newFolder = {name};

  if(!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .from('folders')
    .modify(queryBuilder => {
      queryBuilder
        .where('folders.id', id)
        .update(newFolder)
        .returning(['id','name']);
    })
    .then(results => {
      if (results[0]) {
        res.json(results[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// Create a Folder accepts an object with a name and inserts it in the DB. Returns the new item along the new id.
router.post('/', (req, res, next) => {
  const {name} = req.body;
  const newItem = {name};

  if(!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .insert(newItem)
    .into('folders')
    .returning(['id','name'])
    .then(results => {
      if (results) {
        res.location(`${req.originalUrl}/${results[0].id}`).status(201).json(results[0]);
      }
    })
    .catch(err => next(err));
});

// Delete Folder By Id accepts an ID and deletes the folder from the DB and then returns a 204 status.
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  knex
    .select('id','name')
    .from('folders')
    .modify(queryBuilder => {
      queryBuilder
        .where('folders.id', id)
        .del();
    })
    .then(results => {
      if (results) {
        res.sendStatus(204);
      } else {
        next();
      }      
    })
    .catch(err => next(err));
});


module.exports = router;
