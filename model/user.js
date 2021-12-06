const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;

const userSchema = new Schema({
  name: {
    type: String,
    minLength: 2,
    default: 'Guest',
  },
  password: {
    type: String,
    // required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate(value) {
      const re = /\S+@\S+\.\S+/gi;
      return re.test(String(value).toLowerCase());
    },
  },

  token: {
    type: String,
    default: null,
  },

  avatar: {
    type: String,
    default: null,
  },

  trelloToken: {
    type: String,
    default: null,
  },

  trelloKey: {
    type: String,
    default: null,
  },

  trelloBoardId: {
    type: String,
    default: null,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.validPassword = async function (password) {
  return bcrypt.compare(String(password), this.password);
};

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('user', userSchema);

module.exports = User;
