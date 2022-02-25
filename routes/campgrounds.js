const express = require('express');
const router = express.Router({mergeParams : true});
const { blogSchemaJoi } = require('../JoiSchema.js');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError');
// const { index, renderNewForm, createNewCampground, showCampgrounds, renderNewEditForm, updateCampground, deleteCampground } = require('../controllers/campgrounds.js')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const { storage } = require('../cloudinary/index.js') 
const upload = multer({ storage })

router.get('/', campgrounds.index);

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, upload.array('image'), validateCampground, campgrounds.createNewCampground)

router.get('/:id', campgrounds.showCampgrounds);

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderNewEditForm)

router.put('/:id', isLoggedIn, isAuthor,upload.array('image'), validateCampground, campgrounds.updateCampground);

router.delete('/:id', isLoggedIn, isAuthor, campgrounds.deleteCampground);


module.exports = router;