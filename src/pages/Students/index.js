import React, { useState } from 'react';
import { Svg, Circle } from 'react-native-svg';
/*
import { isEmail } from 'validator';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'; */
import {
  FaUserCircle, FaEdit, FaWindowClose, FaExclamation,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { toast } from 'react-toastify';

import history from '../../services/history';
import { Container } from '../../styles/GlobalStyles';
import {
  StudentContainer, ProfilePicture, LoadingCircle, NewStudent,
} from './styled';
import axios from '../../services/axios';

import Loading from '../../components/Loading';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/students');
      setStudents(response.data);
      setIsLoading(false);
    }

    getData();
  }, []);

  const handleDeleteAsk = (e) => {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.remove();
  };

  const handleDelete = async (e, id, index) => {
    e.persist();

    try {
      const exclamation = e.currentTarget;
      exclamation.setAttribute('display', 'none');
      const loadingCircle = e.currentTarget.nextSibling;
      loadingCircle.setAttribute('style', "{{ display: 'block' }}");
      await axios.delete(`/students/${id}`);
      const newStudents = [...students];
      newStudents.splice(index, 1);
      setStudents(newStudents);
    } catch (err) {
      const status = get(err, 'response.status', []);
      if (status === 401) {
        toast.error('You need to be logged');
        history.push('/login');
      } else {
        toast.error('Unknown error');
        history.push('/login');
      }
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>Students</h1>

      <NewStudent to="student/">New Student</NewStudent>

      <StudentContainer>
        {students && students.length && students.map((student, index) => (
          <div key={String(student.id)}>
            <ProfilePicture>
              {get(student, 'Photos[0].url', false) ? (
                <img
                  crossOrigin=""
                  src={student.Photos[0].url}
                  alt=""
                />
              ) : (
                <FaUserCircle size={36} />
              )}
            </ProfilePicture>

            <span>{student.name}</span>
            <span>{student.email}</span>

            <Link to={`/student/${student.id}/edit`}>
              <FaEdit size={16} />
            </Link>

            <Link onClick={handleDeleteAsk} to={`/student/${student.id}/delete`}>
              <FaWindowClose size={16} />
            </Link>

            <FaExclamation
              size={16}
              display="none"
              cursor="pointer"
              onClick={(e) => handleDelete(e, student.id, index)}
            />

            <LoadingCircle style={{ display: 'none' }}>
              <Svg height={25} width={25}>
                <Circle fill="white" cx={12.5} cy={12.5} r={8} stroke="#C3073F" strokeWidth={5} />
                <Circle fill="white" cx={12.5} cy={12.5} r={8} stroke="#fff" strokeWidth={5} strokeDasharray={50.265} strokeDashoffset={50.265 * 0.8} />
              </Svg>
            </LoadingCircle>

          </div>

        ))}
      </StudentContainer>

    </Container>
  );
}
