import React from "react";
import { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./AddRequest.module.scss";
import { addRequest } from "./../../redux/slices/userSlice";
import { useAuth } from "../../hooks/useAuth";

const AddRequest = ({ house, dispatch }) => {
  const { id, phoneNumber } = useAuth();
  const [isModal, setIsModal] = useState(false);
  const [requestContent, setRequestContent] = useState("");

  const onSubmitClick = () => {
    dispatch(
      addRequest({
        ...house,
        houseProjectId: house.id,
        userId: id,
        userPhone: phoneNumber,
        contentText: requestContent,
      })
    ).then((res) => {
      if (res.payload?.id !== undefined) {
        alert('Запрос успешно отправлен!');
      } else {
        alert(res.error.message)
      }
    });
  };

  return (
    <>
      <button
        className={"button " + styles.buttonRequest}
        onClick={() => setIsModal(true)}
      >
        Подать заявку
      </button>

      {isModal && (
        <Modal
          isVisible={isModal}
          onClose={() => setIsModal(false)}
          title="Запрос на строительство дома"
          content={
            <div className={styles.root}>
              <h4>{house.name}</h4>
              <p>Сообщение запроса:</p>
              <textarea
                className="input"
                placeholder="Введите текст запроса..."
                value={requestContent}
                onChange={(e) => setRequestContent(e.target.value)}
              />
            </div>
          }
          footer={
            <button className="button" onClick={onSubmitClick}>
              Отправить
            </button>
          }
        />
      )}
    </>
  );
};

export default AddRequest;
