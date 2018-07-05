'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');

// Get All (and search by query)
router.get('/', (req, res, next) => {
  const { searchTerm, folderId } = req.query;
  knex
    .select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .modify(queryBuilder => {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folder_id', folderId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// Get a single item
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders','notes.folder_id', 'folders.id')
    .modify(queryBuilder => {
      queryBuilder.where('notes.id', id);
    })
    .then(results => {
      if (results[0]) {
        res.json(results[0]);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const { title, content, folderId } = req.body;

  /***** Never trust users. Validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateItem = {
    title: title,
    content: content,
    folder_id: folderId
  };

  knex
    .from('notes')
    .modify(queryBuilder => {
      queryBuilder
        .where('notes.id',id)
        .update(updateItem);
    })
    .then(() => {
      // Using the noteId, select the note and the folder info
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', id);
    })
    .then(results => {
      res.json(results[0]);
    })
    .catch(err => {
      next(err);
    });
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body;

  const newItem = { 
    title: title, 
    content: content,
    folder_id: (folderId) ? folderId : null };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }


  knex
    .insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      return knex
        .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .from('notes')
        .leftJoin('folders','notes.folder_id', 'folders.id')
        .where('notes.id', id);
    })
    .then(results => {
      if (results) {
        res.location(`http://${req.headers.host}/notes/${results[0].id}`).status(201).json(results[0]);
      }
    })
    .catch(err => {
      next(err);
    });
});


// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  knex
    .from('notes')
    .modify(queryBuilder => {
      queryBuilder
        .where('notes.id', id)
        .del();
    })
    .then(result => {
      if (result) {
        res.sendStatus(204);
      } else {
        next();
      }      
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
