import React from "react";
import { Table } from "react-bootstrap";

const UserTable = ({ items, status, onDelete }) => {
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
              <td className="deleteButton" title="Удалить" onClick={() => onDelete(user)}>
                &#10006;
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
