import React, { useState } from "react";
import AddProjectForm from "./AddProjectForm";
import { Modal } from "react-bootstrap";

const AddAdminProject = ({updateTable}) => {
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <button className="button button--outline" onClick={() => setIsModal(true)}>
        Добавить проект
      </button>

      <Modal show={isModal} onHide={() => setIsModal(false)} className="p-2">
        <Modal.Header closeButton>
          <Modal.Title>Добавление проекта</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <AddProjectForm isPublished={true} closeModal={() => setIsModal(false)} updateTable={updateTable} />
        </Modal.Body>
      </Modal>


    </>
  );
};

export default AddAdminProject;
