const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((cards) => {
      res.status(201).send({ data: cards });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new BadRequestError('Переданы некорректные данные при создании карточки.'),
        );
        return;
      }
      next(error);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(
          new BadRequestError('Переданы некорректные данные.'),
        );
        return;
      }
      next(error);
    });
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(
          new BadRequestError('Переданы некорректные данные.'),
        );
        return;
      }
      next(error);
    });
};

const dislikeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(
          new BadRequestError('Переданы некорректные данные.'),
        );
        return;
      }
      next(error);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
