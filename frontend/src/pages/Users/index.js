import React from 'react';
import { Table, Card } from 'antd';
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    }
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return error.message;

  const dataSource = data.users;
  return (
    <>
      <Card title="Users" bordered={false}>
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Card>
    </>
  );
}

export default Users;
