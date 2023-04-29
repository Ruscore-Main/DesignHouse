import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "nuka-carousel";
import { fetchFullHouseProject } from "../../redux/slices/fullHouseProjectSlice";
import { Navigate, useParams } from "react-router-dom";
import styles from "./FullHouseProject.module.scss";
import AddRequest from "../../components/AddRequest";
import { useAuth } from "../../hooks/useAuth";

const FullHouseProject: React.FC = () => {
  const { data, status } = useSelector(
    ({ fullHouseProject }) => fullHouseProject
  );
  const dispatch = useDispatch();
  const { id } = useParams();

  const {isAuth} = useAuth();

  

  React.useEffect(() => {
    dispatch(fetchFullHouseProject(id));
  }, []);
  
  if (!isAuth) {
    return <Navigate to={'/login'} />
  }

  return status !== "success" ? (
    <div className="container">
      <h2 className={styles.loadingTitle}>Идет загрузка...</h2>
    </div>
  ) : (
    <div className="container">
      <Carousel
        className={styles.carousel}
        autoplay
        wrapAround
        renderCenterLeftControls={({ previousDisabled, previousSlide }) => (
          <button
            onClick={previousSlide}
            disabled={previousDisabled}
            className={styles.prevBtn}
          >
            &lt;
          </button>
        )}
        renderCenterRightControls={({ nextDisabled, nextSlide }) => (
          <button
            onClick={nextSlide}
            disabled={nextDisabled}
            className={styles.nextBtn}
          >
            &gt;
          </button>
        )}
      >
        {data.images.map((img, i: number) => (
          <img
            src={"data:image/jpeg;base64," + img}
            key={i}
            alt="slide"
          />
        ))}
      </Carousel>

      <div className={styles.root}>
        <h2 className={styles.title}>{data.name}</h2>

        <span className={styles.description}>{data.description}</span>
        <span className={styles.datePublication}>
          Дата публикации: {new Date(data.datePublication).toLocaleString()}
        </span>
        <span className={styles.amountFloors}>
          Кол-во этажей: <span className={styles.orange}>{data.amountFloors}</span>
        </span>
        <span className={styles.area}>
          Площадь: <span className={styles.orange}>{data.area}</span> m2
        </span>
        <span className={styles.price}>Цена: от {data.price} ₽</span>
        <AddRequest house={data} dispatch={dispatch} />
      </div>
    </div>
  );
};

export default FullHouseProject;
