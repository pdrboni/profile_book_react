import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const StudentContainer = styled.div`
  margin-top: 20px;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
  }

  div + div {
    border-top: 1px solid rgba(0, 0, 0, 0.4);
  }
`;

export const ProfilePicture = styled.div`
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
`;

export const LoadingCircle = styled.div`
  margin-left: -8px;

  animation: rotate 1s linear infinite;

  @keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
  }
`;

export const NewStudent = styled(Link)`
  display: block;
  padding: 20px 0 10px 0;
`;
