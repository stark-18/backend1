const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/pinterest");
// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://stark1980:anand1980r@pinterest.tgladh9.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  posts: [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Post',
  }],
  dp: {
    type: String, // You might want to store the file path or URL of the profile picture
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

userSchema.plugin(plm);
module.exports = mongoose.model('User', userSchema);


