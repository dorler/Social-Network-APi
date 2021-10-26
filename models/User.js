const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new Schema(
    {
      username: {
        type: String,
        unique: true,
        required: [true, 'username required'],
        trim: true
      },

      email: {
        type: String,
        required: true,
        unique: true,
        validate: [ isEmail, 'email address error']
      },

      Thought: [
        {
          type: Schema.Types.ObjectId,
          ref: "Thought"
        }
      ],

      friends: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      ]
    },

    {
      toJSON: {
        virtuals: true,
        getters: true
      },
      id: false 
    }
  );

  userSchema.virtual('friendCount').get(function () {
    return this.friends.length
  });
  
  const User = model('User', userSchema);
  
  module.exports = User;