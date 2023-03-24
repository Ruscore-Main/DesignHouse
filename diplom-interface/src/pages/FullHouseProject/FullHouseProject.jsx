import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Carousel from 'react-bootstrap/Carousel';
import { fetchFullHouseProject } from '../../redux/slices/fullHouseProjectSlice';
import { useParams } from 'react-router-dom';
import styles from './FullHouseProject.module.scss';

const FullHouseProject = () => {
  const { data, status } = useSelector(({ fullHouseProject }) => fullHouseProject);
  const dispatch = useDispatch();
  const { id } = useParams();

  React.useEffect(() => {
    dispatch(fetchFullHouseProject(id));
  }, []);

  return status !== 'success' ? (
    <div className="container">
      <h2>Идет загрузка...</h2>
    </div>
  ) : (
    <div className="container">
      <div className={styles.root}>
        <h1>{data.name}</h1>
        <Carousel className={styles.carousel}>
          {data.images.map((img) => (
            <Carousel.Item>
              <img src={'data:image/jpeg;base64,' + img} alt="First slide" />
            </Carousel.Item>
          ))}
        </Carousel>
        <span className={styles.description}>{data.description}</span>
        <span className={styles.area}>
          Площадь: <span className={styles.orange}>{data.area}</span> m2
        </span>
        <span className={styles.price}>Цена: от {data.price} ₽</span>
        <button className="button">Подать заявку</button>
      </div>
    </div>
  );
};

export default FullHouseProject;
