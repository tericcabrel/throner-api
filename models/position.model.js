import mongoose from 'mongoose';

const { Schema } = mongoose;

const PositionSchema = new Schema({
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  alt: {
    type: Number,
    required: false,
    default: null,
  },
  session: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'positions',
});

const PositionModel = mongoose.model('Position', PositionSchema);

export const cleanCollection = () => PositionModel.remove({}).exec();

PositionModel.getAll = () => {
  return PositionModel.find({}).sort('-created_at').exec();
};

PositionModel.add = (user) => {
  return user.save();
};

PositionModel.delete = (id) => {
  return PositionModel.remove({ _id: id });
};

PositionModel.get = (id) => {
  return PositionModel.findOne({ _id: id });
};

PositionModel.change = (id, data) => {
  return PositionModel.findOneAndUpdate({ _id: id }, data);
};

PositionModel.getBy = (param) => {
  return PositionModel.find(param);
};

PositionModel.getOneBy = (param) => {
  return PositionModel.findOne(param);
};

PositionModel.bulkDelete = (param) => {
  return PositionModel.deleteMany(param);
};

PositionModel.updateParams = [
  'lat',
  'lon',
  'alt',
];

export default PositionModel;
