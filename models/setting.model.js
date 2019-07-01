import mongoose from 'mongoose';

const { Schema } = mongoose;

const SettingSchema = new Schema({
  stream_url: {
    type: String,
    required: true,
    default: '',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'settings',
});

const SettingModel = mongoose.model('Setting', SettingSchema);

export const cleanCollection = () => SettingModel.remove({}).exec();

SettingModel.getAll = () => {
  return SettingModel.find({}).sort('-created_at').exec();
};

SettingModel.add = (user) => {
  return user.save();
};

SettingModel.delete = (id) => {
  return SettingModel.remove({ _id: id });
};

SettingModel.get = (id) => {
  return SettingModel.findOne({ _id: id });
};

SettingModel.change = (id, data) => {
  return SettingModel.findOneAndUpdate({ _id: id }, data);
};

SettingModel.getBy = (param) => {
  return SettingModel.find(param);
};

SettingModel.getOneBy = (param) => {
  return SettingModel.findOne(param);
};

SettingModel.bulkDelete = (param) => {
  return SettingModel.deleteMany(param);
};

SettingModel.updateParams = [
  'stream_url',
];

export default SettingModel;
