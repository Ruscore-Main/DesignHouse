import React, { useState } from "react";
import Modal from "./Modal";
import AddProjectForm from "./AddProjectForm";

const AddAdminProject = () => {
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <button className="button button--outline" onClick={() => setIsModal(true)}>
        Добавить проект
      </button>

      {isModal && (
        <Modal
          isVisible={isModal}
          onClose={() => setIsModal(false)}
          title="Добавление проекта"
          content={<AddProjectForm isPublished={true} />}
        />
      )}
    </>
  );
};

export default AddAdminProject;
