import mongoose from 'mongoose';

const { Schema } = mongoose;

const CrushSchema = new Schema({
  ipAddress: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  logged: {
    type: Boolean,
    required: false,
    default: false,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'crushs',
});

const CrushModel = mongoose.model('Crush', CrushSchema);

export const cleanCollection = () => CrushModel.remove({}).exec();

CrushModel.getAll = () => {
  return CrushModel.find({}).sort('-created_at').exec();
};

CrushModel.add = (user) => {
  return user.save();
};

CrushModel.delete = (id) => {
  return CrushModel.remove({ _id: id });
};

CrushModel.get = (id) => {
  return CrushModel.findOne({ _id: id });
};

CrushModel.change = (id, data) => {
  return CrushModel.findOneAndUpdate({ _id: id }, data);
};

CrushModel.getBy = (param) => {
  return CrushModel.find(param);
};

CrushModel.getOneBy = (param) => {
  return CrushModel.findOne(param);
};

CrushModel.bulkDelete = (param) => {
  return CrushModel.deleteMany(param);
};

CrushModel.updateParams = [
  'ipAddress',
  'data',
  'logged',
];

export default CrushModel;
