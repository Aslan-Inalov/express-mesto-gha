const User = require('../models/user');
const { ERROR_CODE, ERROR_NOT_FOUND, ERROR_SERVER } = require('../utils/constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res
        .status(ERROR_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы не валидные данные' });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const updateProfile = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const owner = req.user._id;
  const avatar = req.body;

  User.findByIdAndUpdate(owner, avatar, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
};
