import React, { useEffect, useRef, useState } from 'react'
import styles from './EditProject.module.scss';
import swal from 'sweetalert';
import { checkValidation } from '../AddProjectForm';
import { HouseProject, updateProject } from '../../redux/slices/houseProjectSlice';
import defaultImage from "../../assets/img/house-default-image.jpg";
import { useAppDispatch } from 'redux/store';


type Image = {name: number, image: string}
type EditProjectProps = {
  project: HouseProject,
  updateTable: ()=>void,
  closeModal: ()=>void
};
const EditProject: React.FC<EditProjectProps> = ({project, updateTable, closeModal}) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [area, setArea] = useState(project.area);
  const [price, setPrice] = useState(project.price);
  const [floors, setFloors] = useState(project.amountFloors);
  const [images, setImages] = useState<Image[]>([]);
  const [isPublished, setIsPublished] = useState(project.isPublished);
  const [imageSrc, setImageSrc] = useState("");

  const dispatch = useAppDispatch();
  const btnSubmit = useRef(document.createElement('button'));

  useEffect(() => {
    let images: Image[] = [];
    project.images.forEach((img: string, i: number) => {
      images.push({name: i, image: img});
      if (i == 0) {
        setImageSrc('data:image/jpeg;base64,'+img);
      }
    })
    setImages(images);
  }, [])

  const setPreviewImage = (imageName: number) => {
    const img = images.find((el) => el.name == imageName);
    if (img) {
      setImageSrc('data:image/jpeg;base64,'+img.image);
      setImages([img, ...images.filter((el) => el !== img)]);
    }
    
  };

  const onSubmitClick = () => {
    const resValidation = checkValidation(
      name,
      description,
      String(area),
      String(price),
      String(floors),
      images.map(el => el.image)
    );
    if (resValidation !== "") {
      swal({
        icon: "warning",
        text: resValidation,
      });
    } else {
      const formData = new FormData();
      formData.append("id", String(project.id));
      formData.append("name", name);
      formData.append("description", description);
      formData.append("area", String(area));
      formData.append("price", String(price));
      formData.append("amountFloors", String(floors));
      formData.append("isPublished", String(isPublished));
      const sendImages: string[] = [];
      images.forEach((img) => {
        sendImages.push(img.image);
      });

      sendImages.forEach((el) => {
        formData.append("images", el);
      });
      btnSubmit.current.disabled = true;
      dispatch(updateProject(formData)).then((res: any) => {
        if (res.payload?.id !== undefined) {
          swal({
            icon: "success",
            text: "Запрос на добавление проекта успешно отправлен!",
          });
          if (isPublished) {
            updateTable();
          }
          closeModal();
        }
        else {
          swal({
            icon: "error",
            text: "Ошибка, что-то не так с серверной частью :(",
          });
        }
        btnSubmit.current.disabled = false;
      });
    }
  };

  return (
    <>
      <form className={styles.root}>
        {!!images.length && (
          <div className={styles.formGroup}>
            <label>Изображение карточки: </label>
            <select
              className="input"
              placeholder="Введите название"
              value={images[0].name}
              onChange={(e) => setPreviewImage(+e.target.value)}
            >
              {images.map((el) => (
                <option value={el.name} key={el.name}>
                  {el.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className={styles.formGroup}>
          <label>Название: </label>
          <input
            type="text"
            maxLength={99}
            className="input"
            placeholder="Введите название"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className={styles.formGroup}>
          <label>Описание: </label>
          <textarea
            className="input"
            placeholder="Введите описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label>Площадь: </label>
          <input
            type="text"
            maxLength={6}
            className="input"
            placeholder="Введите площадь в m2"
            value={area}
            onChange={(e) => setArea(+e.target.value)}
          ></input>
        </div>
        <div className={styles.formGroup}>
          <label>Цена: </label>
          <input
            type="text"
            className="input"
            placeholder="Введите цену в ₽"
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
          ></input>
        </div>
        <div className={styles.formGroup}>
          <label>Кол-во этажей: </label>
          <input
            type="text"
            maxLength={3}
            className="input"
            placeholder="Введите кол-во этажей"
            value={floors}
            onChange={(e) => setFloors(+e.target.value)}
          ></input>
        </div>
        <div className='d-flex justify-content-start align-items-center'>
          <label>Опубликовано? </label>
          <input
            type="checkbox"
            className='input'
            checked={isPublished ? true : false}
            onChange={() => setIsPublished(!isPublished)}
          ></input>
        </div>
      </form>

      <h4 className={styles.previewTitle}>Превью</h4>
      <div className="item-block">
        <div className="images">
          <img src={imageSrc || defaultImage} className="preview" alt="itemImage" />
        </div>
        <h4 className="item-block__title">{name || "Название"}</h4>
        <span className="item-block__description">
          {description || "Описание"}
        </span>
        <span className="item-block__area">{area} m2</span>
        <span className="item-block__price">{price} ₽</span>
      </div>
      <div className={styles.submitBlock}>
        <button className="button" onClick={onSubmitClick} ref={btnSubmit}>
          Сохранить
        </button>
      </div>
    </>
  )
}

export default EditProject