const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index.js')

module.exports.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCampground = catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body);
    campground.images = req.files.map(f => ({url : f.path, filename : f.filename})) //Here returning the array of image object 
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.showCampgrounds = catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('author')
    .populate(
        {
            path : 'reviews',
            populate : {
                path : 'author'
            }
        }
    )
    if(!campground){
        req.flash('error', "Cannot find that campground")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
})

module.exports.renderNewEditForm = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
})

module.exports.updateCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    const imgData = req.files.map(f => ({url : f.path, filename : f.filename})) //Here returning the array of image object 
    campground.images.push(...imgData) //pushing the images 
    await campground.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
})
