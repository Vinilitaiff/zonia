import User from '../models/User';
import File from '../models/File';
import Tour from '../models/Tour';
import Subscription from '../models/Subscription';

class OrganizerController {
  async index(req, res) {
    try {
      const tours = await Tour.findAll({
        where: {
          organizer_id: req.userID,
        },
        order: [['date']],
      });

      return res.status(200).json(tours);
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  async show(req, res) {
    try {
      const tour = await Tour.findByPk(req.params.id, {
        include: [
          {
            model: File,
            as: 'banner',
            attributes: ['id', 'path', 'url'],
          },
        ],
      });

      if (!tour) {
        return res.status(400).json({ error: 'Tour not found' });
      }

      if (tour.organizer_id !== req.userID) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const subscriptions = await Subscription.findAll({
        where: {
          tour_id: req.params.id,
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
      });

      return res.status(200).json({ tour, subscriptions });
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
}

export default new OrganizerController();
