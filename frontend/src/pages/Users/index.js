import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const usersQuery = gql`
  query {
    users {
      _id
      name
      username
    }
  }
`;

function Users(props) {
  const { loading, error, data } = useQuery(usersQuery);
  if (loading) return <div>Loading...</div>;
  if (error) return error.message;

  console.log(data);
  return <span>Users...</span>;
}

Users.propTypes = {};

export default Users;
