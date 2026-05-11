import React, { ChangeEvent, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import styles from "./AdminAnalysis.module.scss";

type CalculatorValues = {
  constructionCost: number;
  materialsCost: number;
  deliveryCost: number;
  worksCost: number;
  reservePercent: number;
  area: number;
  floors: number;
  activeRequests: number;
};

type CalculatorField = {
  name: keyof CalculatorValues;
  label: string;
  suffix: string;
  min: number;
  max?: number;
  step?: number;
};

const fields: CalculatorField[] = [
  { name: "constructionCost", label: "Стоимость строительства", suffix: "руб.", min: 0 },
  { name: "materialsCost", label: "Стоимость материалов", suffix: "руб.", min: 0 },
  { name: "deliveryCost", label: "Расходы на доставку", suffix: "руб.", min: 0 },
  { name: "worksCost", label: "Стоимость работ", suffix: "руб.", min: 0 },
  { name: "reservePercent", label: "Процент резерва", suffix: "%", min: 5, max: 10, step: 0.5 },
  { name: "area", label: "Площадь объекта", suffix: "м²", min: 1 },
  { name: "floors", label: "Количество этажей", suffix: "эт.", min: 1 },
  { name: "activeRequests", label: "Активные заявки", suffix: "шт.", min: 0 },
];

const initialValues: CalculatorValues = {
  constructionCost: 2800000,
  materialsCost: 1750000,
  deliveryCost: 180000,
  worksCost: 920000,
  reservePercent: 7,
  area: 145,
  floors: 2,
  activeRequests: 8,
};

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 1,
});

const formatCurrency = (value: number) => currencyFormatter.format(Math.max(0, value));

const getAreaDiscount = (area: number) => {
  if (area < 100) {
    return 0;
  }

  return area < 200 ? 3 : 5;
};

const getFloorsDiscount = (floors: number) => {
  if (floors <= 1) {
    return 0;
  }

  return floors === 2 ? 3 : 5;
};

const getDemandDiscount = (activeRequests: number) => {
  if (activeRequests < 5) {
    return 4;
  }

  return activeRequests < 15 ? 2 : 0;
};

const AdminAnalysis = () => {
  const loadedRequestsAmount = useSelector(({ admin }: RootState) => admin.requests.length);
  const [values, setValues] = useState<CalculatorValues>({
    ...initialValues,
    activeRequests: loadedRequestsAmount || initialValues.activeRequests,
  });

  const result = useMemo(() => {
    const baseCost =
      values.constructionCost + values.materialsCost + values.deliveryCost + values.worksCost;
    const reserveCost = (baseCost * values.reservePercent) / 100;
    const totalBeforeDiscount = baseCost + reserveCost;
    const areaDiscount = getAreaDiscount(values.area);
    const floorsDiscount = getFloorsDiscount(values.floors);
    const demandDiscount = getDemandDiscount(values.activeRequests);
    const discountPercent = Math.min(15, areaDiscount + floorsDiscount + demandDiscount);
    const discountCost = (totalBeforeDiscount * discountPercent) / 100;
    const finalCost = totalBeforeDiscount - discountCost;

    return {
      baseCost,
      reserveCost,
      totalBeforeDiscount,
      areaDiscount,
      floorsDiscount,
      demandDiscount,
      discountPercent,
      discountCost,
      finalCost,
    };
  }, [values]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (
      values.constructionCost < 0 ||
      values.materialsCost < 0 ||
      values.deliveryCost < 0 ||
      values.worksCost < 0
    ) {
      errors.push("Стоимостные значения не могут быть отрицательными.");
    }

    if (values.area <= 0) {
      errors.push("Площадь объекта должна быть больше нуля.");
    }

    if (values.floors < 1) {
      errors.push("Количество этажей должно быть не меньше одного.");
    }

    if (values.reservePercent < 5 || values.reservePercent > 10) {
      errors.push("Процент резерва должен находиться в диапазоне от 5% до 10%.");
    }

    if (values.activeRequests < 0) {
      errors.push("Количество активных заявок не может быть отрицательным.");
    }

    return errors;
  }, [values]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof CalculatorValues;
    const nextValue = Number(value);

    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: Number.isNaN(nextValue) ? 0 : nextValue,
    }));
  };

  const setCurrentRequestsAmount = () => {
    setValues((currentValues) => ({
      ...currentValues,
      activeRequests: loadedRequestsAmount,
    }));
  };

  return (
    <section className={styles.analysis}>
      <div className={styles.header}>
        <div>
          <h1>Предварительный расчет стоимости проекта</h1>
        </div>
        <div className={styles.total}>
          <span>К оплате</span>
          <strong>{formatCurrency(result.finalCost)}</strong>
          <small>Скидка {percentFormatter.format(result.discountPercent)}%</small>
        </div>
      </div>

      <div className={styles.content}>
        <form className={styles.form}>
          <div className={styles.formHeader}>
            <h2>Исходные данные</h2>
            <button type="button" onClick={setCurrentRequestsAmount}>
              Подставить заявки: {loadedRequestsAmount}
            </button>
          </div>

          <div className={styles.fields}>
            {fields.map((field) => (
              <label className={styles.field} key={field.name}>
                <span>{field.label}</span>
                <div>
                  <input
                    type="number"
                    name={field.name}
                    value={values[field.name]}
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                    onChange={handleChange}
                  />
                  <small>{field.suffix}</small>
                </div>
              </label>
            ))}
          </div>

          {validationErrors.length > 0 && (
            <div className={styles.errors}>
              {validationErrors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </form>

        <div className={styles.resultPanel}>
          <h2>Результаты расчета</h2>

          <div className={styles.metrics}>
            <div>
              <span>Базовая стоимость</span>
              <strong>{formatCurrency(result.baseCost)}</strong>
            </div>
            <div>
              <span>Резерв</span>
              <strong>{formatCurrency(result.reserveCost)}</strong>
            </div>
            <div>
              <span>До скидки</span>
              <strong>{formatCurrency(result.totalBeforeDiscount)}</strong>
            </div>
            <div>
              <span>Сумма скидки</span>
              <strong>{formatCurrency(result.discountCost)}</strong>
            </div>
          </div>

          <div className={styles.discount}>
            <h3>Структура скидки</h3>
            <div>
              <span>За площадь</span>
              <b>{result.areaDiscount}%</b>
            </div>
            <div>
              <span>За этажность</span>
              <b>{result.floorsDiscount}%</b>
            </div>
            <div>
              <span>По загрузке компании</span>
              <b>{result.demandDiscount}%</b>
            </div>
            <div className={styles.discountTotal}>
              <span>Итоговая скидка</span>
              <b>{result.discountPercent}%</b>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formulas}>
        <h2>Формулы</h2>
        <div className={styles.formulaGrid}>
          <p>Сбаз = Сстр + Смат + Сдост + Сраб</p>
          <p>Срез = Сбаз x Ррез / 100</p>
          <p>Ситог = Сбаз + Срез</p>
          <p>D = min(Dmax, Dплощ + Dэтаж + Dспрос)</p>
          <p>Сскид = Ситог x D / 100</p>
          <p>Ск оплате = Ситог x (1 - D / 100)</p>
        </div>
      </div>
    </section>
  );
};

export default AdminAnalysis;
