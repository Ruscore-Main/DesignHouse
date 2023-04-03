import React, { useState } from 'react'
import Registration from './Registration';
import Modal from './Modal';
import { useDispatch } from 'react-redux';

const AddUser = ({updateTable}) => {
  const [isModal, setIsModal] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <button
        className="button button--outline"
        onClick={() => setIsModal(true)}
      >
        Добавить админа
      </button>

      {isModal && (
        <Modal
          isVisible={isModal}
          onClose={() => setIsModal(false)}
          title="Добавление администратора"
          content={
           <Registration dispatch={dispatch} isAdmin closeModal={() => setIsModal(false)} updateTable={updateTable}/>
          }
        />
      )}
    </>
  )
}

export default AddUser