import React from 'react';
import { adminAPI, houseProjectsAPI } from '../../api/api';
import { HouseProject } from '../../redux/slices/houseProjectSlice';
import { Request } from '../../redux/slices/userSlice';
import styles from './AdminAnalysis.module.scss';

const PROJECTS_LIMIT = 1000;
const REQUESTS_LIMIT = 1000;
const PROJECTS_PER_PAGE = 6;

const floorCoefficients: Record<number, number> = {
  1: 1,
  2: 1.15,
  3: 1.25,
};

const formatMoney = (value: number) =>
  `${Math.round(value).toLocaleString('ru-RU')} ₽`;

const formatNumber = (value: number, digits = 1) =>
  value.toLocaleString('ru-RU', {
    maximumFractionDigits: digits,
  });

const getFloorCoefficient = (floors: number) => floorCoefficients[floors] || 1.3;

const getAreaDiscount = (area: number) => {
  if (area >= 200) return 7;
  if (area >= 150) return 5;
  if (area >= 100) return 3;
  return 0;
};

const getFloorDiscount = (floors: number) => {
  if (floors >= 3) return 2;
  if (floors === 2) return 1;
  return 0;
};

const getDemandDiscount = (requestCount: number) => {
  if (requestCount >= 5) return 3;
  if (requestCount >= 3) return 2;
  if (requestCount >= 1) return 1;
  return 0;
};

const AdminAnalysis: React.FC = () => {
  const [projects, setProjects] = React.useState<HouseProject[]>([]);
  const [requests, setRequests] = React.useState<Request[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [selectedProjectId, setSelectedProjectId] = React.useState<number | null>(null);
  const [basePrice, setBasePrice] = React.useState(55000);
  const [reservePercent, setReservePercent] = React.useState(7);

  React.useEffect(() => {
    setIsLoading(true);
    Promise.all([
      houseProjectsAPI.getProjects(
        1,
        { name: 'name', sort: 'name' },
        null,
        '',
        null,
        PROJECTS_LIMIT,
      ),
      adminAPI.getRequests({
        page: '1',
        limit: REQUESTS_LIMIT.toString(),
        category: null,
        searchValue: '',
      }),
    ])
      .then(([projectsData, requestsData]) => {
        const loadedProjects = projectsData.items || [];
        setProjects(loadedProjects);
        setRequests(requestsData.items || []);
        setSelectedProjectId(loadedProjects[0]?.id || null);
      })
      .catch(() => setError('Не удалось загрузить данные для анализа'))
      .finally(() => setIsLoading(false));
  }, []);

  const publishedProjects = projects.filter((project) => Boolean(project.isPublished));
  const totalArea = projects.reduce((sum, project) => sum + project.area, 0);
  const totalPrice = projects.reduce((sum, project) => sum + project.price, 0);
  const averageArea = projects.length ? totalArea / projects.length : 0;
  const averagePrice = projects.length ? totalPrice / projects.length : 0;
  const averagePricePerMeter = totalArea ? totalPrice / totalArea : 0;
  const pagesCount = Math.ceil(publishedProjects.length / PROJECTS_PER_PAGE);

  const requestsByProject = requests.reduce<Record<number, number>>((acc, request) => {
    acc[request.houseProjectId] = (acc[request.houseProjectId] || 0) + 1;
    return acc;
  }, {});

  const selectedProject = projects.find((project) => project.id === selectedProjectId) || null;
  const floorCoefficient = selectedProject
    ? getFloorCoefficient(selectedProject.amountFloors)
    : 1;
  const buildCost = selectedProject
    ? selectedProject.area * basePrice * floorCoefficient
    : 0;
  const reserveCost = buildCost * (reservePercent / 100);
  const finalCost = buildCost + reserveCost;
  const selectedProjectRequests = selectedProject ? requestsByProject[selectedProject.id] || 0 : 0;
  const areaDiscount = selectedProject ? getAreaDiscount(selectedProject.area) : 0;
  const floorDiscount = selectedProject ? getFloorDiscount(selectedProject.amountFloors) : 0;
  const demandDiscount = getDemandDiscount(selectedProjectRequests);
  const discountPercent = Math.min(15, areaDiscount + floorDiscount + demandDiscount);
  const discountAmount = finalCost * (discountPercent / 100);
  const finalCostWithDiscount = finalCost - discountAmount;

  const demandRows = [...projects]
    .sort((a, b) => (requestsByProject[b.id] || 0) - (requestsByProject[a.id] || 0))
    .slice(0, 5)
    .map((project) => {
      const requestCount = requestsByProject[project.id] || 0;
      const pricePerMeter = project.area ? project.price / project.area : 0;
      const demandIndex = requestCount * 0.6;

      return {
        ...project,
        requestCount,
        pricePerMeter,
        demandIndex,
      };
    });

  if (isLoading) {
    return <h2 className={styles.status}>Загрузка аналитических данных...</h2>;
  }

  if (error) {
    return <h2 className={styles.status}>{error}</h2>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h2>Анализ проектов</h2>
          <p>
            Раздел рассчитывает показатели каталога строительных проектов:
            стоимость одного квадратного метра, ориентировочную стоимость
            строительства, количество страниц каталога и спрос по заявкам.
          </p>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span>Всего проектов</span>
          <strong>{projects.length}</strong>
        </div>
        <div className={styles.metric}>
          <span>Опубликовано</span>
          <strong>{publishedProjects.length}</strong>
        </div>
        <div className={styles.metric}>
          <span>Средняя площадь</span>
          <strong>{formatNumber(averageArea)} м²</strong>
        </div>
        <div className={styles.metric}>
          <span>Средняя цена за м²</span>
          <strong>{formatMoney(averagePricePerMeter)}</strong>
        </div>
      </div>

      <section className={styles.section}>
        <h3>Расчет стоимости строительства</h3>
        <span className={styles.formula}>
          Cитог = S × Cбаз × Kэтаж + Cрез
        </span>

        <div className={styles.calculator}>
          <div className={styles.field}>
            <label>Проект</label>
            <select
              className="input"
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}>
              {projects.map((project) => (
                <option value={project.id} key={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Базовая стоимость 1 м²</label>
            <input
              className="input"
              type="number"
              min="1"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label>Резерв, %</label>
            <input
              className="input"
              type="number"
              min="0"
              value={reservePercent}
              onChange={(e) => setReservePercent(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.result}>
          <div className={styles.resultItem}>
            <span>Коэффициент этажности</span>
            <strong>{floorCoefficient}</strong>
          </div>
          <div className={styles.resultItem}>
            <span>Резерв</span>
            <strong>{formatMoney(reserveCost)}</strong>
          </div>
          <div className={styles.resultItem}>
            <span>Итоговая оценка</span>
            <strong>{formatMoney(finalCost)}</strong>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Расчет страниц каталога</h3>
        <span className={styles.formula}>Nстр = ceil(N / L)</span>
        <p>
          При {publishedProjects.length} опубликованных проектах и выводе по{' '}
          {PROJECTS_PER_PAGE} карточек на страницу каталог содержит{' '}
          <b>{pagesCount}</b> стр.
        </p>
      </section>

      <section className={styles.section}>
        <h3>Расчет скидки</h3>
        <span className={styles.formula}>
          D = min(15%, Dплощ + Dэтаж + Dспрос)
        </span>
        <p>
          Скидка рассчитывается для выбранного проекта с учетом площади, этажности
          и количества заявок. Максимальная скидка ограничена 15%.
        </p>

        <div className={styles.result}>
          <div className={styles.resultItem}>
            <span>Коэффициент площади</span>
            <strong>{areaDiscount}%</strong>
          </div>
          <div className={styles.resultItem}>
            <span>Коэффициент этажности</span>
            <strong>{floorDiscount}%</strong>
          </div>
          <div className={styles.resultItem}>
            <span>Коэффициент спроса</span>
            <strong>{demandDiscount}%</strong>
          </div>
        </div>

        <div className={styles.result}>
          <div className={styles.resultItem}>
            <span>Итоговая скидка</span>
            <strong>{discountPercent}%</strong>
          </div>
          <div className={styles.resultItem}>
            <span>Сумма скидки</span>
            <strong>{formatMoney(discountAmount)}</strong>
          </div>
          <div className={styles.resultItem}>
            <span>Цена после скидки</span>
            <strong>{formatMoney(finalCostWithDiscount)}</strong>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Анализ спроса по заявкам</h3>
        <span className={styles.formula}>R = 0.6 × Q</span>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Проект</th>
                <th>Площадь</th>
                <th>Цена</th>
                <th>Цена за м²</th>
                <th>Заявки</th>
                <th>Индекс спроса</th>
              </tr>
            </thead>
            <tbody>
              {demandRows.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.area} м²</td>
                  <td>{formatMoney(project.price)}</td>
                  <td>{formatMoney(project.pricePerMeter)}</td>
                  <td>{project.requestCount}</td>
                  <td>{formatNumber(project.demandIndex)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Общие показатели каталога</h3>
        <div className={styles.result}>
          <div className={styles.resultItem}>
            <span>Средняя стоимость проекта</span>
            <strong>{formatMoney(averagePrice)}</strong>
          </div>
          <div className={styles.resultItem}>
            <span>Суммарная площадь</span>
            <strong>{formatNumber(totalArea)} м²</strong>
          </div>
          <div className={styles.resultItem}>
            <span>Всего заявок</span>
            <strong>{requests.length}</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAnalysis;
