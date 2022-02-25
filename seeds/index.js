const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection error"))
db.once("open", () => {
    console.log("Database Connected")
})
const Campground = require('../models/campground')
const cities = require('./cities')
const seedHelper = require('./seedHelpers')

const seedDb = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i < 50; i++){
        const random50 = Math.floor(Math.random() * 50)
        const random20 = Math.floor(Math.random() * 18)
        const campPrice = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title : `${seedHelper.descriptors[random20]} ${seedHelper.places[random20]}`,
            author : '61980e38d0434ea0060a9172',
            location :`${cities[random50].city}, ${cities[random50].state}`, 
            description : 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem earum tempora quas quia ipsum corrupti iure beatae repellat, fugit, sed dolorum quae, necessitatibus praesentium ea officiis fuga inventore temporibus illo?',
            price : campPrice, 
            images : [
                {
                  url: 'https://res.cloudinary.com/dbdf37z9g/image/upload/v1638529477/YelpCamp/zkxmm0ppqwkgmar8b85d.jpg',
                  filename: 'YelpCamp/zkxmm0ppqwkgmar8b85d',
                },
                {
                  url: 'https://res.cloudinary.com/dbdf37z9g/image/upload/v1638529477/YelpCamp/pkv5t2mddskz4txjwnup.jpg',
                  filename: 'YelpCamp/pkv5t2mddskz4txjwnup',
                }
            ]
        })
        await camp.save()
    }
}

seedDb()