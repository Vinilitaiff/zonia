import React, { useState } from 'react';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { MdAddCircleOutline } from 'react-icons/md';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';

import BannerInput from '~/components/BannerInput';
import DatePicker from '~/components/DatePicker';

import { Container } from './CreateTour_Styles';

export default function CreateTour() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    try {
      setLoading(true);
      console.tron.log(data);
      // const response = await api.post('tours', data);
      // toast.success('Tour criado com sucesso!');
      // history.push(`/tour/${response.data.id}`);
    } catch (err) {
      toast.error('Erro ao criar o Tour. Tente novamente.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const schema = Yup.object().shape({
    // banner_id: Yup.number()
    //  .transform(value => (!value ? undefined : value))
    //  .required('Banner is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    // date: Yup.date().required('Date is required'),
    location: Yup.string().required('Location is required'),
  });

  return (
    <Container>
      <Form schema={schema} onSubmit={handleSubmit}>
        <BannerInput name="banner_id" />
        <Input name="title" placeholder="Title" />
        <Input name="description" placeholder="Description" multiline />
        <DatePicker name="date" placeholder="Date" />
        <Input name="location" placeholder="Location" />

        <button type="submit" disabled={loading}>
          <MdAddCircleOutline size={22} color="#fff" />
          Create
        </button>
      </Form>
    </Container>
  );
}
