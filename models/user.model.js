import mongoose from 'mongoose';

import uuid from 'uuid/v4';

const { Schema } = mongoose;

const UserSchema = new Schema({
  user_id: {
    type: String,
    default: uuid(),
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email_token: {
    type: String,
    required: false,
    unique: true,
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: String,
  avatar: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', resetPasswordExpires: 'reset_password_expires' }, collection: 'users' });

const UserModel = mongoose.model('User', UserSchema);

export const cleanCollection = () => UserModel.remove({}).exec();

UserModel.getAll = () => {
  return UserModel.find({}).sort('-created_at').exec();
};

UserModel.add = (user) => {
  return user.save();
};

UserModel.delete = (id) => {
  return UserModel.remove({ user_id: id });
};

UserModel.get = (id) => {
  return UserModel.findOne({ user_id: id });
};

UserModel.change = (id, data) => {
  return UserModel.findOneAndUpdate({ user_id: id }, data);
};

UserModel.getBy = (param) => {
  return UserModel.find(param);
};

UserModel.updateParams = [
  'name',
  'username',
  'email',
  'password',
  'confirmed',
  'avatar',
];

export default UserModel;
