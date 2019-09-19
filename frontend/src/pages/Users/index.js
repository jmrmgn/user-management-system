import React, { useState } from 'react';
import { Table, Card, Button } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const usersQuery = gql`
  query {
    users {
      _id
      name
      username
      friends {
        _id
        username
      }
    }
  }
`;

const addFriendMutation = gql`
  mutation AddFriend($id: ID!) {
    addFriend(id: $id) {
      _id
      name
      username
    }
  }
`;

function Users(props) {
  // const currentUser = useQuery(currentUserQuery);
  const { loading, error, data } = useQuery(usersQuery);
  const [currentId, setCurrentId] = useState(undefined);
  const [addFriend, _addFriend] = useMutation(addFriendMutation);

  const handleAddFriend = id => async e => {
    setCurrentId(id);
    await addFriend({
      variables: { id }
    });
  };

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
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const id = record._id;

        return (
          <Button
            onClick={handleAddFriend(id)}
            loading={_addFriend.loading && currentId === id}
          >
            Add Friend
          </Button>
        );
      }
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

Users.propTypes = {};

export default Users;
