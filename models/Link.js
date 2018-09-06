const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = mongoose.model('User');

const LinkSchema = new mongoose.Schema({
  url: { type: String, unique: true },
  title: String,
  description: String,
  favoritesCount: { type: Number, default: 0 },
  image: String,
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

LinkSchema.plugin(uniqueValidator, {url: 'this link already exist'});

LinkSchema.methods.updateFavoriteCount = function() {
  const link = this;
  return User.count({ favorites: {$in: [link._id]} }).then(function(count) {
    link.favoritesCount = count;
    return link.save();
  })
}

LinkSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    image: this.image,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Link', LinkSchema);
