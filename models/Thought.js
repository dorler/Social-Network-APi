const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const reactionSchema = new Schema ( {
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
      reactionBody: {
        type: String,
        required: true,
        max: 280
      },
      username: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      }
    },

    {
      toJSON: {
        getters: true
      },
      id: false
    }
),

const thoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: true,
        min: 1,
        max: 280
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      },
      username: {
        type: String,
        required: true,
      },
      reactions: [ReactionSchema]
    },
    {
      toJSON: {
        virtuals: true,
        getters: true
      },
      id: false
    }
  );
  
  thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
  });
  
  const thought = model('thought', thoughtSchema);
  
  module.exports = thought;