import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  isEmail, isInt, isFloat,
} from 'validator';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import axios from '../../services/axios';
import history from '../../services/history';
import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';

export default function Student({ match }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/student/${id}`);
        const Photo = get(data, 'Photos[0].url', '');

        setPhoto(Photo);
        setName(data.name);
        setLastname(data.lastname);
        setEmail(data.email);
        setAge(data.age);
        setWeight(data.weight);
        setHeight(data.height);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) {
          errors.map((error) => toast.error(error));
        }
        history.push('/');
      }
      setIsLoading(false);
    }
    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (name.length < 3 || name.length > 255) {
      toast.error('Name need to have between 3 and 255 characters');
      formErrors = true;
    }

    if (lastname.length < 3 || lastname.length > 255) {
      toast.error('Lastname need to have between 3 and 255 characters');
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error('Invalid Email');
      formErrors = true;
    }

    if (!isInt(String(age))) {
      toast.error('Invalid age');
      formErrors = true;
    }

    if (!isFloat(String(weight))) {
      toast.error('Invalid weight');
      formErrors = true;
    }

    if (!isFloat(String(height))) {
      toast.error('Invalid height');
      formErrors = true;
    }

    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        await axios.put(`/students/${id}`, {
          name,
          lastname,
          email,
          age,
          weight,
          height,
        });
        toast.success('Success, the student was edited!');
      } else {
        await axios.post('/students/', {
          name,
          lastname,
          email,
          age,
          weight,
          height,
        });
        toast.success('Success, the student was created!');
      }
    } catch (err) {
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('Unknown Error');
      }
      if (status === 401) dispatch(actions.loginFailure());
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Edit' : 'Create new student'}</Title>

      {id && (
        <ProfilePicture>
          {photo
            ? <img src={photo} alt={name} crossOrigin="" />
            : <FaUserCircle size={180} />}
          <Link to={`/photos/${id}`}>
            <FaEdit size={24} />
            <span>Edit picture</span>
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Lastname"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="age"
        />
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="weight"
        />
        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="height"
        />

        <button type="submit">Submit</button>
      </Form>
    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
