import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class NewSubscriptionMail {
  get key() {
    return 'NewSubscriptionMail';
  }

  async handle({ data }) {
    const { tour, user } = data;

    await Mail.sendMail({
      to: `${tour.organizer.name} <${tour.organizer.email}>`,
      subject: `Nova inscrição (${tour.title})`,
      template: 'newSubscription',
      context: {
        organizer: tour.organizer.name,
        tourTitle: tour.title,
        tourDate: format(
          parseISO(tour.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: ptBR,
          }
        ),
        userName: user.name,
        userEmail: user.email,
      },
    });
  }
}

export default new NewSubscriptionMail();
