import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import styles from "./HouseProjectTable.module.scss";
import classNames from "classnames";
import { Link } from "react-router-dom";
import EditProject from "../EditProject";
import { Modal } from "react-bootstrap";
import { HouseProject, Status } from "redux/slices/houseProjectSlice";
import { useAppDispatch } from "redux/store";
import { resetHouse } from "redux/slices/fullHouseProjectSlice";

type HouseProjectTableProps = {
  items: HouseProject[],
  status: Status,
  onDelete: (project: HouseProject)=>void,
  updateTable: ()=>void
};
const HouseProjectsTable: React.FC<HouseProjectTableProps> = ({ items, status, onDelete, updateTable }) => {
  const [isModal, setIsModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<HouseProject|null>(null);
  const dispatch = useAppDispatch();
  const onClickEdit = (project: HouseProject) => {
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
          {currentProject && <EditProject projectId={currentProject.id} updateTable={updateTable} closeModal={() => {
            dispatch(resetHouse());
            setIsModal(false)}} />}
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
