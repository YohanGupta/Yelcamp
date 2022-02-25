const { blogSchemaJoi } = require('./JoiSchema.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const { reviewSchema } = require('./JoiSchema.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = blogSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    console.log(campground)
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to edit")
        return res.redirect(`/campgrounds/${id}`)
    } 
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author._id.equals(req.user._id)){
        req.flash("error", "You do not have permission to delet")
        return req.redirect(`/campgrounds/${id}`)
    }
    next()
}