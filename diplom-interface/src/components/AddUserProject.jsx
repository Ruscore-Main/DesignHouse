import React, { useState } from "react";
import AddProjectForm from "./AddProjectForm";
import Modal from "./Modal";

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
            <AddProjectForm closeModal={() => setIsModal(false)} isPublished={false}  />
          }
        />
      )}
    </>
  );
};

export default AddUserProject;
