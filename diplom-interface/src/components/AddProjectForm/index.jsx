import React, { useState } from "react";
import styles from "./AddProjectForm.module.scss";
import defaultImage from "assets/img/house-default-image.jpg";
import imageInfo from "assets/img/information-image.svg";
import { useDispatch } from "react-redux";
import { addProject } from "redux/slices/houseProjectSlice";

const checkValidation = (name, description, area, price, floors, images) => {
  let res = "";
  if (name.length == 0) res += "Название не должно быть пустым;\n";
  if (description.length == 0) res += "Описание не должно быть пустым;\n";
  if (isNaN(area)) res += "Площадь должна быть числом;\n";
  if (isNaN(price)) res += "Цена должна быть числом;\n";
  if (isNaN(floors)) res += "Кол-во этажей должна быть числом;\n";
  if (+area <= 0) res += "Площадь должна быть больше 0;\n";
  if (+price <= 0) res += "Цена должна быть больше 0;\n";
  if (+floors <= 0) res += "Количество этажей должно быть больше 0;\n";
  if (
    !Number.isInteger(+area) &&
    !Number.isInteger(+price) &&
    !Number.isInteger(+floors)
  )
    res += "Числа должны быть целочисленными;\n";
  if (!images.length) res += "Не загружено ни одно изображение;\n";

  return res;
};

const AddProjectForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState();
  const [price, setPrice] = useState();
  const [floors, setFloors] = useState();
  const [images, setImages] = useState([]);
  const [imageSrc, setImageSrc] = useState("");

  const dispatch = useDispatch();

  const setPreviewImage = (imageName) => {
    const file = images.find(el => el.name == imageName);
    const reader = new FileReader();
    reader.onload = (x) => {
      setImageSrc(x.target.result);
    };
    reader.readAsDataURL(file);
    setImages([file, ...images.filter(el => el !== file)]);
  }
 
  const onSubmitClick = () => {
    debugger;
    const resValidation = checkValidation(
      name,
      description,
      area,
      price,
      floors,
      images
    );
    if (resValidation !== "") {
      alert(resValidation);
    } else {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('area', +area);
      formData.append('price', +price);
      formData.append('amountFloors', +floors);
      formData.append('isPublished', true);
      const sendImages = [];
      images.forEach((img, i) => {
        sendImages.push(img);
      })
      sendImages.forEach(el => {
        formData.append('images', el);
      });
      dispatch(addProject(formData)).then((res) => {
        console.log(res);
        if (res.payload?.login !== undefined) {
          alert('Запрос на добавление проекта успешно отправлен!')
        } else {
          alert(res.payload);
        }
      });
    }
  };


  const showPreview = (e) => {
    let files = e.target.files;
    let loadedImages = []
    if (files && files[0]) {
      for (let i = 0; i < files.length; i++) {
        let imageFile = files[i];
        const reader = new FileReader();
        reader.onload = (x) => {
          setImageSrc(x.target.result);
        };
        reader.readAsDataURL(imageFile);
        loadedImages.push(imageFile);
      }
      setImages(loadedImages);
    }
  };

  //debugger;

  return (
    <>
      <form className={styles.root}>
        <div className={styles.formGroup}>
          <label className={styles.projectImage}>
            Изображения:
            <div className={styles.imageInformation}>
              <img src={imageInfo} alt="info" />
              <div className={styles.imageDescription}>
                <ul>
                  <li>Вы можете выбрать несколько изображений</li>
                  <li>Первое загруженное изображение - Карточка проекта</li>
                  <li>
                    Рекомендуемые соотношения сторон для изображения карточки
                    проекта: 16:9, 4:3
                  </li>
                  <li>Рекомендуемый размер изображения: 850 &times; 460 px</li>
                </ul>
              </div>
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            className="input"
            multiple
            onChange={showPreview}
          ></input>
        </div>
        {!!images.length && (
          <div className={styles.formGroup}>
            <label>Изображение карточки: </label>
            <select
              type=""
              maxLength="99"
              className="input"
              placeholder="Введите название"
              value={images[0].name}
              onChange={(e) => setPreviewImage(e.target.value)}
            >
              {images.map(el => <option value={el.name} key={el.name}>{el.name}</option>)}
            </select>
          </div>
        )}
        <div className={styles.formGroup}>
          <label>Название: </label>
          <input
            type="text"
            maxLength="99"
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
            maxLength="6"
            className="input"
            placeholder="Введите площадь в m2"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          ></input>
        </div>
        <div className={styles.formGroup}>
          <label>Цена: </label>
          <input
            type="text"
            className="input"
            placeholder="Введите цену в ₽"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></input>
        </div>
        <div className={styles.formGroup}>
          <label>Кол-во этажей: </label>
          <input
            type="text"
            maxLength="3"
            className="input"
            placeholder="Введите кол-во этажей"
            value={floors}
            onChange={(e) => setFloors(e.target.value)}
          ></input>
        </div>
      </form>

      <h4 className={styles.previewTitle}>Превью</h4>
      <div className="item-block">
        <div className="images">
          <img src={imageSrc || defaultImage} alt="itemImage" />
        </div>
        <h4 className="item-block__title">{name || "Название"}</h4>
        <span className="item-block__description">
          {description || "Описание"}
        </span>
        <span className="item-block__area">{area} m2</span>
        <span className="item-block__price">{price} ₽</span>
      </div>
      <div className={styles.submitBlock}>
        <button className="button" onClick={onSubmitClick}>
          Отправить
        </button>
      </div>
    </>
  );
};

export default AddProjectForm;
