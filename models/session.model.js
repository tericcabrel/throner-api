import mongoose from 'mongoose';

const { Schema } = mongoose;

const SessionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'sessions',
});

const SessionModel = mongoose.model('Session', SessionSchema);

export const cleanCollection = () => SessionModel.remove({}).exec();

SessionModel.getAll = () => {
  return SessionModel.find({}).sort('-created_at').exec();
};

SessionModel.add = (user) => {
  return user.save();
};

SessionModel.delete = (id) => {
  return SessionModel.remove({ _id: id });
};

SessionModel.get = (id) => {
  return SessionModel.findOne({ _id: id });
};

SessionModel.change = (id, data) => {
  return SessionModel.findOneAndUpdate({ _id: id }, data);
};

SessionModel.getBy = (param) => {
  return SessionModel.find(param);
};

SessionModel.getOneBy = (param) => {
  return SessionModel.findOne(param);
};

SessionModel.bulkDelete = (param) => {
  return SessionModel.deleteMany(param);
};

SessionModel.updateParams = [
  'name',
];

export default SessionModel;
