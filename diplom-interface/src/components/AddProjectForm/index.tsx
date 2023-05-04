import React, { useRef, useState } from 'react';
import styles from './AddProjectForm.module.scss';
import defaultImage from '../../assets/img/house-default-image.jpg';
import imageInfo from '../../assets/img/information-image.svg';
import { addProject } from 'redux/slices/houseProjectSlice';
import swal from 'sweetalert';
import { useAppDispatch } from 'redux/store';

type AddProjectFormProps = {
  isPublished: boolean;
  closeModal: () => void;
  updateTable?: () => void;
};

export const checkValidation = (
  name: string,
  description: string,
  area: string,
  price: string,
  floors: string,
  images: File[] | string[],
) => {
  let res = '';
  if (name.length == 0) res += 'Название не должно быть пустым;\n';
  if (description.length == 0) res += 'Описание не должно быть пустым;\n';
  if (isNaN(+area)) res += 'Площадь должна быть числом;\n';
  if (isNaN(+price)) res += 'Цена должна быть числом;\n';
  if (isNaN(+floors)) res += 'Кол-во этажей должна быть числом;\n';
  if (+area <= 0) res += 'Площадь должна быть больше 0;\n';
  if (+price <= 0) res += 'Цена должна быть больше 0;\n';
  if (+floors <= 0) res += 'Количество этажей должно быть больше 0;\n';
  if (!Number.isInteger(+area) && !Number.isInteger(+price) && !Number.isInteger(+floors))
    res += 'Числа должны быть целочисленными;\n';
  if (!images.length) res += 'Не загружено ни одно изображение;\n';

  return res;
};

const AddProjectForm: React.FC<AddProjectFormProps> = ({
  isPublished,
  closeModal,
  updateTable,
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [floors, setFloors] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageSrc, setImageSrc] = useState('');
  const [infoText, setInfoText] = useState('');

  const btnSubmit = useRef(document.createElement('button'));
  const dispatch = useAppDispatch();

  // Show selected image
  const setPreviewImage = (imageName: string) => {
    const file = images.find((el) => el.name == imageName);
    const reader = new FileReader();
    reader.onload = (x: any) => {
      setImageSrc(x.target.result);
    };
    if (file) {
      reader.readAsDataURL(file);
      setImages([file, ...images.filter((el) => el.name !== file.name)]);
    }
  };

  const onSubmitClick = () => {
    const resValidation = checkValidation(name, description, area, price, floors, images);
    if (resValidation !== '') {
      swal({
        icon: 'warning',
        text: resValidation,
      });
    } else {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('area', area);
      formData.append('price', price);
      formData.append('amountFloors', floors);
      formData.append('isPublished', isPublished.toString());

      images.forEach((el) => {
        formData.append('images', el);
      });
      console.log('IMAGES ==== ', images);
      btnSubmit.current.disabled = true;
      dispatch(addProject(formData)).then((res: any) => {
        if (res !== undefined) {
          swal({
            icon: 'success',
            text: 'Запрос на добавление проекта успешно отправлен!',
          });
          if (isPublished) {
            updateTable && updateTable();
          }
          closeModal();
        } else {
          swal({
            icon: 'error',
            text: 'Ошибка, что-то не так с серверной частью :(',
          });
        }
        btnSubmit.current.disabled = false;

      });
    }
  };

  // Show dialog-select images
  const showPreview = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    let loadedImages = [];
    if (files && files[0]) {
      let maxLength = files.length <= 10 ? files.length : 10;
      if (files.length > 10) {
        setInfoText('Количество выбранных изображений превышает допустимое. Общее количество будет обрезано до 10');
      }
      for (let i = 0; i < maxLength; i++) {
        let imageFile = files[i];
        const reader = new FileReader();
        reader.onload = (x: any) => {
          setImageSrc(x.target.result);
        };
        await reader.readAsDataURL(imageFile);
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
                    Рекомендуемые соотношения сторон для изображения карточки проекта: 16:9, 4:3
                  </li>
                  <li>Рекомендуемый размер изображения: 850 &times; 460 px</li>
                  <li>Максимальное кол-во изображений: 10</li>
                </ul>
              </div>
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            className="input form-control"
            multiple
            onChange={showPreview}
            maxLength={10}></input>
        </div>
        {!!images.length && (
          <div className={styles.formGroup}>
            <label>Изображение карточки: </label>
            <select
              className="input"
              placeholder="Введите название"
              value={images[0].name}
              onChange={(e) => setPreviewImage(e.target.value)}>
              {images.map((el) => (
                <option value={el.name} key={el.name}>
                  {el.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <p className='not-valid'>{infoText}</p>
        <div className={styles.formGroup}>
          <label>Название: </label>
          <input
            type="text"
            maxLength={99}
            className="input"
            placeholder="Введите название"
            value={name}
            onChange={(e) => setName(e.target.value)}></input>
        </div>
        <div className={styles.formGroup}>
          <label>Описание: </label>
          <textarea
            className="input"
            placeholder="Введите описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div className={styles.formGroup}>
          <label>Площадь: </label>
          <input
            type="text"
            maxLength={6}
            className="input"
            placeholder="Введите площадь в m2"
            value={area}
            onChange={(e) => setArea(e.target.value)}></input>
        </div>
        <div className={styles.formGroup}>
          <label>Цена: </label>
          <input
            type="text"
            className="input"
            placeholder="Введите цену в ₽"
            value={price}
            onChange={(e) => setPrice(e.target.value)}></input>
        </div>
        <div className={styles.formGroup}>
          <label>Кол-во этажей: </label>
          <input
            type="text"
            maxLength={3}
            className="input"
            placeholder="Введите кол-во этажей"
            value={floors}
            onChange={(e) => setFloors(e.target.value)}></input>
        </div>
      </form>

      <h4 className={styles.previewTitle}>Превью</h4>
      <div className="item-block">
        <div className="images">
          <img src={imageSrc || defaultImage} className="preview" alt="itemImage" />
        </div>
        <h4 className="item-block__title">{name || 'Название'}</h4>
        <span className="item-block__description">{description || 'Описание'}</span>
        <span className="item-block__area">{area} m2</span>
        <span className="item-block__price">{price} ₽</span>
      </div>
      <div className={styles.submitBlock}>
        <button className="button" onClick={onSubmitClick} ref={btnSubmit}>
          Отправить
        </button>
      </div>
    </>
  );
};

export default AddProjectForm;
