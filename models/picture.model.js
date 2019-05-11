import mongoose from 'mongoose';

const { Schema } = mongoose;

const PictureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimetype: {
    type: String,
    required: false,
    default: null,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'pictures',
});

const PictureModel = mongoose.model('Picture', PictureSchema);

export const cleanCollection = () => PictureModel.remove({}).exec();

PictureModel.getAll = () => {
  return PictureModel.find({}).sort('-created_at').exec();
};

PictureModel.add = (user) => {
  return user.save();
};

PictureModel.delete = (id) => {
  return PictureModel.remove({ _id: id });
};

PictureModel.get = (id) => {
  return PictureModel.findOne({ _id: id });
};

PictureModel.change = (id, data) => {
  return PictureModel.findOneAndUpdate({ _id: id }, data);
};

PictureModel.getBy = (param) => {
  return PictureModel.find(param);
};

PictureModel.getOneBy = (param) => {
  return PictureModel.findOne(param);
};

PictureModel.bulkDelete = (param) => {
  return PictureModel.deleteMany(param);
};

PictureModel.toJSON = (appUrl, picture) => {
  const { _id, name, originalname, size, mimetype, created_at, updated_at } = picture;
  return {
    _id,
    name: `${appUrl}/uploads/pictures/${name}`,
    originalname,
    size,
    mimetype,
    created_at,
    updated_at,
  };
};

PictureModel.updateParams = [
  'name',
  'originalname',
  'size',
  'mimetype',
];

export default PictureModel;
