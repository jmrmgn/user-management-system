const mongoose = require('mongoose');
const { hash } = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    username: String,
    password: String,
    friends: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
});

module.exports = mongoose.model('User', userSchema);
