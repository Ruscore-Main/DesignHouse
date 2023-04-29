import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import styles from "./HouseProjectTable.module.scss";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import EditProject from "../../components/EditProject";
import { Button, Modal } from "react-bootstrap";

const HouseProjectsTable = ({ items, status, onDelete, updateTable }) => {
  const [isModal, setIsModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const dispatch = useDispatch();

  const onClickEdit = (project) => {
    setCurrentProject(project);
    setIsModal(true);
  }
  return (
    <>
      <Modal show={isModal} onHide={() => setIsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Изменение проекта</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditProject project={currentProject} updateTable={updateTable} closeModal={() => setIsModal(false)} />
        </Modal.Body>
      </Modal>

      <Table hover responsive striped className="mb-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Площадь</th>
            <th>Цена</th>
            <th>Дата публикации</th>
            <th>Статус</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {status === "success" ? (
            items.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>
                  <Link className="link" to={`/house/${project.id}`}>
                    {project.name}
                  </Link>
                </td>
                <td>{project.area} m2</td>
                <td>{project.price} ₽</td>
                <td>{new Date(project.datePublication).toLocaleString()}</td>
                <td
                  className={classNames({
                    [styles.published]: project.isPublished,
                    [styles.unpublished]: !project.isPublished,
                  })}
                >
                  {project.isPublished ? "Опубликованный" : "Предложенный"}
                </td>
                <td>
                  <button className="button" onClick={() => onClickEdit(project)}>Редактировать</button>
                </td>
                <td>
                  <span
                    className="deleteButton"
                    onClick={() => onDelete(project)}
                    title="Удалить"
                  >
                    &#10006;
                  </span>
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
    </>
  );
};

export default HouseProjectsTable;
