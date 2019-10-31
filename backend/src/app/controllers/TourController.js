import { parseISO, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';

import Tour from '../models/Tour';
import User from '../models/User';
import File from '../models/File';

class TourController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    if (isBefore(parseISO(req.body.date), Date.now())) {
      return res
        .status(401)
        .json({ error: `You can't create a tour on a past date` });
    }

    try {
      const tour = await Tour.create({
        ...req.body,
        organizer_id: req.userID,
      });

      return res.status(201).json(tour);
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  async index(req, res) {
    const { page = 1, date } = req.query;
    const pageLimit = 10;

    const parsedDate = parseISO(date);

    try {
      const tours = await Tour.findAndCountAll({
        where: {
          date: {
            [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
          },
        },
        limit: pageLimit,
        offset: (page - 1) * pageLimit,
        order: [['date']],
        include: [
          {
            model: User,
            as: 'organizer',
            attributes: ['id', 'name'],
          },
          { model: File, as: 'banner', attributes: ['id', 'path', 'url'] },
        ],
      });

      const totalPages = Math.ceil(tours.count / pageLimit);

      return res.status(200).json({ totalPages, tours });
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    try {
      const tour = await Tour.findByPk(req.params.id);

      if (!tour) {
        return res.status(400).json({ error: 'Tour not found' });
      }

      if (tour.organizer_id !== req.userID) {
        return res
          .status(401)
          .json({ error: `You don't have authorization to edit this Tour` });
      }

      if (tour.past) {
        return res.status(400).json({ error: "Can't update past Tour" });
      }

      await tour.update(req.body);

      return res.status(200).json(tour);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async delete(req, res) {
    try {
      const tour = await Tour.findByPk(req.params.id);

      if (!tour) {
        return res.status(400).json({ error: 'Tour not found' });
      }

      const { title } = tour;

      if (tour.organizer_id !== req.userID) {
        return res.status(401).json({
          error: `You don't have authorization to delete this Tour`,
        });
      }

      if (tour.past) {
        return res.status(400).json({ error: "Can't delete past Tour" });
      }

      await tour.destroy();

      return res
        .status(200)
        .json({ success: `Tour "${title}" has been canceled` })
        .send();
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
}

export default new TourController();
