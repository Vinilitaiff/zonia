import React, { useState, useEffect } from 'react';

import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { MdSave, MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';
import Loader from 'react-loader-spinner';

import api from '~/services/api';
import history from '~/services/history';

import BannerInput from '~/components/BannerInput';
import DatePicker from '~/components/DatePicker';

import { Container } from './EditTour_Styles';

export default function EditTour({ match }) {
  const { id } = match.params;

  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState(null);

  useEffect(() => {
    async function loadTour() {
      try {
        const response = await api.get(`organizers/${id}`);
        setTour({
          ...response.data.tour,
          date: parseISO(response.data.tour.date),
        });
        setLoading(false);
      } catch (err) {
        toast.error('Tour not found');
        history.push('/');
      }
    }

    loadTour();
  }, [id]);

  async function handleSubmit(data) {
    try {
      setLoading(true);
      await api.put(`tours/${id}`, data);
      toast.success('Tour editado com sucesso!');
      history.push(`/tour/${id}`);
    } catch (err) {
      toast.error('Erro ao editar o Tour. Tente novamente.');
      setLoading(false);
    }
  }

  async function handleCancel() {
    try {
      await api.delete(`tours/${id}`);
      toast.success('Tour cancelado com sucesso!');
      history.push('/dashboard');
    } catch (err) {
      toast.error('Erro ao cancelar o Tour. Tente novamente.');
    }
  }

  const schema = Yup.object().shape({
    banner_id: Yup.number()
      .transform(value => (!value ? undefined : value))
      .required('Banner is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date().required('Date is required'),
    location: Yup.string().required('Location is required'),
  });

  return (
    <Container>
      {loading ? (
        <div className="loading">
          <Loader type="TailSpin" color="#e65175" width={32} height={32} />
        </div>
      ) : (
        <Form schema={schema} initialData={tour} onSubmit={handleSubmit}>
          <BannerInput name="banner_id" />
          <Input name="title" placeholder="Title" />
          <Input name="description" placeholder="Description" multiline />
          <DatePicker name="date" placeholder="Date" />
          <Input name="location" placeholder="Location" />

          <nav>
            <button type="button" className="cancel" onClick={handleCancel}>
              <MdDeleteForever size={20} color="#e65175" />
              Cancelar Tour
            </button>

            <button type="submit" disabled={loading}>
              <MdSave size={20} color="#fff" />
              Salvar
            </button>
          </nav>
        </Form>
      )}
    </Container>
  );
}
