import React from 'react'

const home = () => {
  const list = React.useRef();
  return (
    <div className="wrapper">

      <div className="header">
        <div className="container">
          <div className="header__logo">
            <span className="gray">Design</span>
            <span className="orange">House</span>
          </div>
          <div className="header__icons">
            <img className="icon--small" src={logoutIcom} />
            <img className="icon" src={accountIcon} />
          </div>
        </div>
      </div>



      <div className="description-block">
        <div className="description-block__content">
          <p>
            На нашей платформе вы можете найти дизайн для вашего будущего дома и предложить свои
            варинаты в личном кабинете пользователя
          </p>
          <button className="button button--outline" onClick={() => list.current.scrollIntoView({behavior: "smooth"})}>Подобрать проект</button>
        </div>
        <img src={descriptionImg} />
      </div>



      <div className="container">

        <div className="content__top">
      
          <div className="filters">
            <div className="search">
              <svg
                enableBackground="new 0 0 32 32"
                id="Glyph"
                version="1.1"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M27.414,24.586l-5.077-5.077C23.386,17.928,24,16.035,24,14c0-5.514-4.486-10-10-10S4,8.486,4,14  s4.486,10,10,10c2.035,0,3.928-0.614,5.509-1.663l5.077,5.077c0.78,0.781,2.048,0.781,2.828,0  C28.195,26.633,28.195,25.367,27.414,24.586z M7,14c0-3.86,3.14-7,7-7s7,3.14,7,7s-3.14,7-7,7S7,17.86,7,14z"
                  id="XMLID_223_"
                />
              </svg>
              <input placeholder="Поиск проекта.." type="text" />
              <svg
                id="Layer_1"
                version="1.1"
                viewBox="0 0 512 512"
                className="clear"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
              </svg>
            </div>
            <div className="categories">
              <ul>
                <li className="active">Все</li>
                <li>Одноэтажные</li>
                <li>Двухэтажные</li>
                <li>Более этажей</li>
              </ul>
            </div>
          </div>

          <div className="sort">
            <div className="sort__label">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
                  fill="#2C2C2C"
                />
              </svg>
              <b>Сортировка по:</b>
              <span>Названию (ASC)</span>
            </div>
            <div className="sort__popup">
              <ul>
                <li>Названию (ASC)</li>
                <li>Названию (DESC)</li>
                <li>Площади (ASC)</li>
                <li>Площади (DESC)</li>
                <li>Дате создания (ASC)</li>
                <li>Дате создания (DESC)</li>
              </ul>
            </div>
          </div>

        </div>

        

        <div className="content">
          <h2 className="content__title" ref={list}>Список проектов</h2>

          <div className="content__items">

            <div className="item-block">
              <img src={itemImage} />
              <h4 className="item-block__title">Красивый дом с лужайкой</h4>
              <span className="item-block__description">Красивый дом с лужайкой и окантовкой из красного кирпича, добаляющая ему собственную красоту</span>
              <span className="item-block__area">250 m2</span>
              <span className="item-block__price">3.500.000 ₽</span>
              <div className="like-item">
              <img src={heartImage} />
              </div>
            </div>

            <div className="item-block">
              <img src={itemImage} />
              <h4 className="item-block__title">Красивый дом с лужайкой</h4>
              <span className="item-block__description">Красивый дом с лужайкой и окантовкой из красного кирпича, добаляющая ему собственную красоту</span>
              <span className="item-block__area">250 m2</span>
              <span className="item-block__price">от 3.500.000 ₽</span>
              <div className="like-item">
              <img src={heartImage} />
              </div>
            </div>

            <div className="item-block">
              <img src={itemImage} />
              <h4 className="item-block__title">Красивый дом с лужайкой</h4>
              <span className="item-block__description">Красивый дом с лужайкой и окантовкой из красного кирпича, добаляющая ему собственную красоту</span>
              <span className="item-block__area">250 m2</span>
              <span className="item-block__price">от 3.500.000 ₽</span>
              <div className="like-item">
              <img src={heartImage} />
              </div>
            </div>


            <div className="item-block">
              <img src={itemImage} />
              <h4 className="item-block__title">Красивый дом с лужайкой</h4>
              <span className="item-block__description">Красивый дом с лужайкой и окантовкой из красного кирпича, добаляющая ему собственную красоту</span>
              <span className="item-block__area">250 m2</span>
              <span className="item-block__price">от 3.500.000 ₽</span>
              <div className="like-item">
              <img src={heartImage} />
              </div>
            </div>


            <div className="item-block">
              <img src={itemImage} />
              <h4 className="item-block__title">Красивый дом с лужайкой</h4>
              <span className="item-block__description">Красивый дом с лужайкой и окантовкой из красного кирпича, добаляющая ему собственную красоту</span>
              <span className="item-block__area">250 m2</span>
              <span className="item-block__price">от 3.500.000 ₽</span>
              <div className="like-item">
              <img src={heartImage} />
              </div>
            </div>

            
          </div>

        </div>
      </div>
    </div>
  )
}

export default home