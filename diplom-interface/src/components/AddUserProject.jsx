import React, { useState } from "react";
import AddProjectForm from "./AddProjectForm";
import { Modal } from "react-bootstrap";

const AddUserProject = () => {
  const [isModal, setIsModal] = useState(false);

  

  return (
    <>
      <p>*Вы можете предложить свой собственный дизайн - проект дома</p>
      <button className="button" onClick={() => setIsModal(true)}>Добавить проект</button>
      <Modal show={isModal} onHide={() => setIsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Запрос на строительство дома</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <AddProjectForm closeModal={() => setIsModal(false)} isPublished={false}  />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddUserProject;
