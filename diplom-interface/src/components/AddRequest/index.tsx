import React from "react";
import { useState } from "react";
import styles from "./AddRequest.module.scss";
import { addRequest } from "../../redux/slices/userSlice";
import { useAuth } from "../../hooks/useAuth";
import swal from "sweetalert";
import { Modal } from "react-bootstrap";
import { AppDispatch } from "redux/store";
import { HouseProject } from "redux/slices/houseProjectSlice";

type AddRequestProps = {
  house: HouseProject,
  dispatch: AppDispatch
}
const AddRequest: React.FC<AddRequestProps> = ({ house, dispatch }) => {
  const { id, phoneNumber } = useAuth();
  const [isModal, setIsModal] = useState(false);
  const [requestContent, setRequestContent] = useState("");

  const onSubmitClick = () => {
    if (id && phoneNumber) {
      dispatch(
        addRequest({
          ...house,
          houseProjectId: house.id,
          userId: id,
          userPhone: phoneNumber,
          contentText: requestContent,
        })
      ).then((res: any) => {
        if (res.payload?.id !== undefined) {
          swal({
            icon: "success",
            text: "Запрос успешно отправлен!",
          });
        } else {
          swal({
            icon: "error",
            text: res.error.message,
          });
        }
      });
    }
    
  };

  return (
    <>
      <button
        className={"button " + styles.buttonRequest}
        onClick={() => setIsModal(true)}
      >
        Подать заявку
      </button>

      <Modal show={isModal} onHide={() => setIsModal(false)} className="p-2">
        <Modal.Header closeButton>
          <Modal.Title>Запрос на строительство дома</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <button className="button mx-auto" onClick={onSubmitClick}>
            Отправить
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddRequest;
