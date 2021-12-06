const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const dayjs = require('dayjs');

const sprintSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
      transform: date => dayjs(date).format('YYYY-MM-DD'),
    },

    duration: {
      type: Number,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      default: function () {
        return dayjs(this.startDate).add(this.duration, 'day');
      },
      transform: date => dayjs(date).format('YYYY-MM-DD'),
    },

    allScheduledTime: {
      type: Number,
      default: 0,
    },

    totalDaly: {
      type: Array,
      default: function () {
        const arr = new Array(this.duration).fill();

        const taskDay = (startDate, i) =>
          dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');

        return arr.map((_, i) => {
          return {
            [taskDay(this.startDate, i)]: 0,
          };
        });
      },
    },

    project: {
      type: SchemaTypes.ObjectId,
      ref: 'project',
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true,
      // transform: function (_doc, ret) {
      //   delete ret._id;
      //   return ret;
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

const Sprint = mongoose.model('sprint', sprintSchema);

module.exports = Sprint;
