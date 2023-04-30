import React from 'react'

import descriptionImg from '../assets/img/description-image.jpg';


const Description = ({list}:{list: React.MutableRefObject<HTMLDivElement>}) => {
  if (list == null) return <></>
  return (
    <div className="description-block">
        <div className="description-block__content">
          <p>
            На нашей платформе вы можете найти дизайн для вашего будущего дома и предложить свои
            варинаты в личном кабинете пользователя
          </p>
          <button className="button button--outline" onClick={() => list.current.scrollIntoView({behavior: "smooth"})}>Подобрать проект</button>
        </div>
        <img src={descriptionImg} alt="houseImage"/>
      </div>
  )
}

export default Description