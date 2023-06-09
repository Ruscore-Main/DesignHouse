import React from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { Status } from "redux/slices/houseProjectSlice";
import { Request } from "redux/slices/userSlice";

type RequestTableProps = {
  items: (Request & {userLogin: string, dateCreating: Date, userEmail: string})[],
  status: Status,
  onComplete: (req: Request)=>void
}
const RequestTable: React.FC<RequestTableProps> = ({ items, status, onComplete }) => {
  return (
    <Table hover responsive striped className="mt-2 mb-4">
      <thead>
        <tr>
          <th>#</th>
          <th>Логин</th>
          <th>Проект</th>
          <th>Текст запроса</th>
          <th>Дата создания</th>
          <th>Номер телефона</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {status === 'success' ?  items.map(request => <tr key={request.id}>
            <td>{request.id}</td>
            <td>{request.userLogin}</td>
            <td><Link className="link" to={`/house/${request.houseProjectId}`}>{request.name}</Link></td>
            <td>{request.contentText}</td>
            <td>{new Date(request.dateCreating).toLocaleString()}</td>
            <td><Link className="link" to={`tel:${request.userPhone}`}>{request.userPhone}</Link></td>
            <td>{request.userEmail}</td>
            <td className="pointer" title="Выполнить" onClick={() => onComplete(request)}>✔️</td>
        </tr>) : <tr>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
        </tr> }
      </tbody>
    </Table>
  );
};

export default RequestTable;
