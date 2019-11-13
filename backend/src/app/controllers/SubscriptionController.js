import { Op } from 'sequelize';

import User from '../models/User';
import File from '../models/File';
import Tour from '../models/Tour';
import Subscription from '../models/Subscription';

import Queue from '../../lib/Queue';
import NewSubscriptionMail from '../jobs/NewSubscriptionMail';

class SubscriptionController {
  async store(req, res) {
    try {
      const tour = await Tour.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'organizer',
          },
        ],
      });

      const { userID } = req;

      const user = await User.findByPk(userID);

      if (!tour) {
        return res.status(400).json({ error: 'Tour not found' });
      }

      if (tour.organizer_id === userID) {
        return res
          .status(400)
          .json({ error: "You're already subscribed to your own Tour" });
      }

      if (tour.past) {
        return res.status(400).json({
          error: "You're can't subscribe to Tours that have already happened",
        });
      }

      const isUserSubscribed = await Subscription.findOne({
        where: {
          tour_id: tour.id,
          user_id: userID,
        },
      });

      if (isUserSubscribed) {
        return res.status(400).json({
          error: "You're already subscribed to this Tour",
        });
      }

      const hasTourOnTheSameDay = await Subscription.findOne({
        where: {
          user_id: userID,
        },
        include: [
          {
            model: Tour,
            as: 'tour',
            where: { date: tour.date },
          },
        ],
      });

      if (hasTourOnTheSameDay) {
        return res.status(400).json({
          error:
            "You're already are subscribed to a Tour that happens on the same date",
        });
      }

      const userSubscription = await Subscription.create({
        tour_id: tour.id,
        user_id: userID,
      });

      await Queue.add(NewSubscriptionMail.key, {
        tour,
        user,
      });

      return res.status(201).json(userSubscription);
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  async index(req, res) {
    try {
      const subscriptions = await Subscription.findAll({
        where: {
          user_id: req.userID,
        },
        include: [
          {
            model: Tour,
            as: 'tour',
            where: {
              date: {
                [Op.gt]: new Date(),
              },
            },
            include: [
              {
                model: User,
                as: 'organizer',
                attributes: ['id', 'name', 'email'],
              },
              {
                model: File,
                as: 'banner',
                attributes: ['id', 'path', 'url'],
              },
            ],
          },
        ],
      });

      return res.status(200).json(subscriptions);
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  async delete(req, res) {
    try {
      const subscription = await Subscription.findByPk(req.params.id);

      if (!subscription) {
        return res.status(400).json({
          error: "You're not subscribed to this Tour",
        });
      }

      await subscription.destroy();

      return res
        .status(200)
        .json({ success: 'Your subscription to this Tour has been canceled' })
        .send();
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
}

export default new SubscriptionController();
