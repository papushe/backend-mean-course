const express = require('express');
const router = express.Router();

const postController = require('../controllers/posts');

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

router.post('', checkAuth, extractFile, postController.createPost);

router.get('', postController.getPosts);

router.get('/:id', postController.getPostById);

router.put('/:id', checkAuth, extractFile, postController.updatePost);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;
