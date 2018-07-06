'use strict';

const knex = require('../knex');

const searchTerm = 'cat';

//get by searchTerm
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(results[0]);
//   })
//   .catch(err => {
//     console.error(err);
//   });
const searchID = 1005;

// get note by id
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     queryBuilder.where('notes.id', searchID);
//   })
//   .then(results => {
//     console.log(results[0]);
//   })
//   .catch(err => {
//     console.err(err);
//   });

//update note by id
const updateID = 1009;
const updateNote = {title: 'Richard has an filler dog', content: 'filler text'};
// knex
//   .from('notes')
//   .modify(queryBuilder => {
//     queryBuilder
//       .where('notes.id',updateID)
//       .update(updateNote)
//       .returning(['id','title','content']);
//   })
//   .then(results => {
//     console.log(results[0]);
//   })
//   .catch(err => {
//     console.err(err);
//   });

//create a new note
const newNote = {title: 'Richard has an awesome dog', content: 'filler text'};

// knex
//   .from('notes')
//   .modify(queryBuilder => {
//     queryBuilder
//       .insert(newNote)
//       .returning(['id','title','content']);
//   })
//   .then(results => {
//     console.log(results[0]);
//   })
//   .catch(err => {
//     console.err(err);
//   });

const deleteID = 1012;

// knex
//   .from('notes')
//   .modify(queryBuilder => {
//     queryBuilder
//       .where('notes.id', deleteID)
//       .del();
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .catch(err => {
//     console.err(err);
//   });

const noteId = 99;
const result = [34, 56, 78].map(tagId => ({ note_id: noteId, tag_id: tagId }));
console.log(`insert: ${result} into notes_tags`);