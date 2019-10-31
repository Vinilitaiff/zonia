import React, { useState, useEffect } from 'react';

import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { MdAddCircleOutline, MdDateRange, MdLocationOn } from 'react-icons/md';

import api from '~/services/api';

import { Container, ToursList, Tour } from './Dashboard_Styles';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await api.get('organizers');

      const data = response.data.map(tour => {
        return {
          ...tour,
          formattedDate: format(parseISO(tour.date), "dd/MM/Y 'às' HH'h'mm"),
        };
      });

      setTours(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Container>
      {!loading && (
        <header>
          <h2>Meus Tours</h2>
          <Link to="tour/create">
            <MdAddCircleOutline color="#fff" size={22} />
            Novo Tours
          </Link>
        </header>
      )}

      <ToursList>
        {loading && (
          <aside>
            <Loader type="TailSpin" color="#F94D6A" width={32} height={32} />
          </aside>
        )}

        {!loading && !tours.length && (
          <aside>Você ainda não possui nenhum Tour :(</aside>
        )}

        {!loading &&
          tours.map(tour => (
            <Tour
              to={`/tour/${tour.id}`}
              key={tour.id}
              past={tour.past ? 1 : 0}
            >
              <h3>{tour.title}</h3>
              <div>
                <p>
                  <MdDateRange size={16} />
                  {tour.formattedDate}
                </p>
                <p>
                  <MdLocationOn size={16} />
                  {tour.location}
                </p>
              </div>
            </Tour>
          ))}
      </ToursList>
    </Container>
  );
}
