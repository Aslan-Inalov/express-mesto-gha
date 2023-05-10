const usersRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUser);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
