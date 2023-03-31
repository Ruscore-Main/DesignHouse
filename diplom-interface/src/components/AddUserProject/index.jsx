import React, { useState } from "react";
import AddProjectForm from "../AddProjectForm";
import Modal from "../Modal";
import styles from './AddUserProject.module.scss'

const AddUserProject = () => {
  const [isModal, setIsModal] = useState(false);

  

  return (
    <>
      <p>*Вы можете предложить свой собственный дизайн - проект дома</p>
      <button className="button" onClick={() => setIsModal(true)}>Добавить проект</button>

      {isModal && (
        <Modal
          isVisible={isModal}
          onClose={() => setIsModal(false)}
          title="Добавление проекта"
          content={
            <AddProjectForm />
          }
        />
      )}
    </>
  );
};

export default AddUserProject;
