import Sequelize, { Model } from 'sequelize';
import { isBefore, parseISO, subHours } from 'date-fns';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        canceled_at: Sequelize.DATE,
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(parseISO(this.date), 6));
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Tour, {
      foreignKey: 'tour_id',
      as: 'tour',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default Subscription;
