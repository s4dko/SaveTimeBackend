const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for project'],
    },
    description: {
      type: String,
    },
    favorite: {
        type: Boolean,
        default: false
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
    participants: [String],
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true,
      // transform: function (_doc, ret) {
      //   delete ret._id;
      //   retu ret;
      // },
    },
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  },
);

const Project = mongoose.model('project', projectSchema);

module.exports = Project;
