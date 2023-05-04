import { useAuth } from "hooks/useAuth";
import React from "react";
import { Table } from "react-bootstrap";
import { Status } from "redux/slices/houseProjectSlice";
import { User } from "redux/slices/userSlice";

type UserTableProps = {
  items: User[],
  status: Status,
  onDelete: (user: User)=>void
};


const UserTable: React.FC<UserTableProps> = ({ items, status, onDelete }) => {
  const {id} = useAuth();
  return (
    <Table hover responsive striped className="mt-2 mb-4">
      <thead>
        <tr>
          <th>#</th>
          <th>Логин</th>
          <th>Роль</th>
          <th>Email</th>
          <th>Номер телефона</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {status === "success" ? (
          items.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.login}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
                <td>
                {id === user.id || <span className="deleteButton" title="Удалить" onClick={() => onDelete(user)}>&#10006;</span>}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
            <td>...</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default UserTable;
