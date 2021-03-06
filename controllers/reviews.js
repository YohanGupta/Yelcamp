const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review.js')
const Campground = require('../models/campground');

module.exports.createReview = catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body)
    review.author = req.user._id;
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.deleteReview = catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
})