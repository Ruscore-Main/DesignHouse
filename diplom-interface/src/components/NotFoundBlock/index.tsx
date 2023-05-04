import React from 'react';
import styles from './NotFoundBlock.module.scss';

const emogies = ['😮', '🤕', '😱', '😾', '💅', '☀', '🍄', '🗿', '🎲', '😨', '😢', '🤷']

const NotFoundBlock = () => {
  let rand = Math.floor(Math.random() * emogies.length);

  return (
    <div className={styles.root}>
      <h1>
        <span>{emogies[rand]}</span>
        <br />
        Ничего не найдено
      </h1>
      <p>К сожалению, данная страница отсутствует на нашем сайте</p>
    </div>
  );
};

export default NotFoundBlock;