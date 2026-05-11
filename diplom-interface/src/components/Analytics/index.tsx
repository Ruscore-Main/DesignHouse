import React, { useState } from "react";
import styles from "./Analytics.module.scss";

type CalcInputs = {
  constructionCost: string;
  materialsCost: string;
  deliveryCost: string;
  workCost: string;
  reservePercent: string;
  area: string;
  floors: string;
  activeRequests: string;
};

type CalcResult = {
  baseCost: number;
  reserve: number;
  totalBeforeDiscount: number;
  discountArea: number;
  discountFloors: number;
  discountDemand: number;
  discountPercent: number;
  discountAmount: number;
  finalCost: number;
};

const D_MAX = 15;

function calcDiscountArea(S: number): number {
  if (S < 100) return 0;
  if (S < 200) return 3;
  return 5;
}

function calcDiscountFloors(F: number): number {
  if (F === 1) return 0;
  if (F === 2) return 3;
  return 5;
}

function calcDiscountDemand(N: number): number {
  if (N < 5) return 4;
  if (N < 15) return 2;
  return 0;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  });
}

const Analytics: React.FC = () => {
  const [inputs, setInputs] = useState<CalcInputs>({
    constructionCost: "",
    materialsCost: "",
    deliveryCost: "",
    workCost: "",
    reservePercent: "5",
    area: "",
    floors: "1",
    activeRequests: "",
  });
  const [result, setResult] = useState<CalcResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setResult(null);
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    const { constructionCost, materialsCost, deliveryCost, workCost, reservePercent, area, floors, activeRequests } = inputs;

    if (constructionCost === "" || +constructionCost < 0)
      errs.push("Стоимость строительства не может быть отрицательной");
    if (materialsCost === "" || +materialsCost < 0)
      errs.push("Стоимость материалов не может быть отрицательной");
    if (deliveryCost === "" || +deliveryCost < 0)
      errs.push("Расходы на доставку не могут быть отрицательными");
    if (workCost === "" || +workCost < 0)
      errs.push("Стоимость работ не может быть отрицательной");
    if (area === "" || +area <= 0)
      errs.push("Площадь объекта должна быть больше нуля");
    if (floors === "" || +floors < 1 || !Number.isInteger(+floors))
      errs.push("Количество этажей — целое число, не менее 1");
    if (reservePercent === "" || +reservePercent < 0 || +reservePercent > 100)
      errs.push("Процент резерва должен быть в диапазоне от 0 до 100");
    if (activeRequests === "" || +activeRequests < 0 || !Number.isInteger(+activeRequests))
      errs.push("Количество активных заявок — целое неотрицательное число");

    return errs;
  };

  const calculate = () => {
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;

    const cStr = +inputs.constructionCost;
    const cMat = +inputs.materialsCost;
    const cDel = +inputs.deliveryCost;
    const cWork = +inputs.workCost;
    const rRes = +inputs.reservePercent;
    const S = +inputs.area;
    const F = +inputs.floors;
    const N = +inputs.activeRequests;

    const baseCost = cStr + cMat + cDel + cWork;
    const reserve = baseCost * (rRes / 100);
    const totalBeforeDiscount = baseCost + reserve;

    const discountArea = calcDiscountArea(S);
    const discountFloors = calcDiscountFloors(F);
    const discountDemand = calcDiscountDemand(N);
    const discountPercent = Math.min(D_MAX, discountArea + discountFloors + discountDemand);
    const discountAmount = totalBeforeDiscount * (discountPercent / 100);
    const finalCost = totalBeforeDiscount - discountAmount;

    setResult({
      baseCost,
      reserve,
      totalBeforeDiscount,
      discountArea,
      discountFloors,
      discountDemand,
      discountPercent,
      discountAmount,
      finalCost,
    });
  };

  const costFields: { label: string; name: keyof CalcInputs }[] = [
    { label: "Стоимость строительства (С стр), ₽", name: "constructionCost" },
    { label: "Стоимость материалов (С мат), ₽", name: "materialsCost" },
    { label: "Расходы на доставку (С дост), ₽", name: "deliveryCost" },
    { label: "Стоимость работ (С раб), ₽", name: "workCost" },
  ];

  return (
    <div className={styles.root}>
      <h4>Калькулятор стоимости проекта</h4>
      <p className={styles.description}>
        Предварительный расчёт стоимости строительного проекта на основе введённых параметров.
        Не заменяет полноценную смету, но позволяет быстро оценить заявку и подготовить
        ориентировочное коммерческое предложение.
      </p>

      <div className={styles.form}>
        <div className={styles.section}>
          <h5>Затраты</h5>
          <div className={styles.grid}>
            {costFields.map(({ label, name }) => (
              <label key={name} className={styles.field}>
                <span>{label}</span>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="any"
                  name={name}
                  value={inputs[name]}
                  onChange={handleChange}
                  placeholder="0"
                />
              </label>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h5>Параметры объекта</h5>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Площадь объекта (S), м²</span>
              <input
                className="input"
                type="number"
                min="1"
                step="any"
                name="area"
                value={inputs.area}
                onChange={handleChange}
                placeholder="0"
              />
            </label>
            <label className={styles.field}>
              <span>Количество этажей (F)</span>
              <input
                className="input"
                type="number"
                min="1"
                step="1"
                name="floors"
                value={inputs.floors}
                onChange={handleChange}
                placeholder="1"
              />
            </label>
            <label className={styles.field}>
              <span>Активных заявок в системе (N)</span>
              <input
                className="input"
                type="number"
                min="0"
                step="1"
                name="activeRequests"
                value={inputs.activeRequests}
                onChange={handleChange}
                placeholder="0"
              />
            </label>
            <label className={styles.field}>
              <span>Процент резерва (Р рез), %</span>
              <input
                className="input"
                type="number"
                min="0"
                max="100"
                step="any"
                name="reservePercent"
                value={inputs.reservePercent}
                onChange={handleChange}
                placeholder="5"
              />
            </label>
          </div>
        </div>

        {errors.length > 0 && (
          <ul className={styles.errors}>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

        <button className="button" onClick={calculate}>
          Рассчитать
        </button>
      </div>

      {result && (
        <div className={styles.result}>
          <h5>Результат расчёта</h5>
          <table className={styles.resultTable}>
            <tbody>
              <tr>
                <td>Стоимость строительства</td>
                <td>{formatCurrency(+inputs.constructionCost)}</td>
              </tr>
              <tr>
                <td>Стоимость материалов</td>
                <td>{formatCurrency(+inputs.materialsCost)}</td>
              </tr>
              <tr>
                <td>Расходы на доставку</td>
                <td>{formatCurrency(+inputs.deliveryCost)}</td>
              </tr>
              <tr>
                <td>Стоимость работ</td>
                <td>{formatCurrency(+inputs.workCost)}</td>
              </tr>
              <tr className={styles.subtotal}>
                <td>Базовая стоимость (С_баз)</td>
                <td>{formatCurrency(result.baseCost)}</td>
              </tr>
              <tr>
                <td>Резерв {inputs.reservePercent}%</td>
                <td>{formatCurrency(result.reserve)}</td>
              </tr>
              <tr className={styles.subtotal}>
                <td>Итоговая стоимость до скидки (С_итог)</td>
                <td>{formatCurrency(result.totalBeforeDiscount)}</td>
              </tr>
              <tr>
                <td>
                  Скидка за площадь (S&nbsp;=&nbsp;{inputs.area}&nbsp;м²)
                </td>
                <td>{result.discountArea}%</td>
              </tr>
              <tr>
                <td>
                  Скидка за этажность (F&nbsp;=&nbsp;{inputs.floors})
                </td>
                <td>{result.discountFloors}%</td>
              </tr>
              <tr>
                <td>
                  Скидка по спросу (N&nbsp;=&nbsp;{inputs.activeRequests}&nbsp;заявок)
                </td>
                <td>{result.discountDemand}%</td>
              </tr>
              <tr className={styles.subtotal}>
                <td>Итоговая скидка D (не более {D_MAX}%)</td>
                <td>{result.discountPercent}%</td>
              </tr>
              <tr>
                <td>Сумма скидки (С_скид)</td>
                <td>−&nbsp;{formatCurrency(result.discountAmount)}</td>
              </tr>
              <tr className={styles.total}>
                <td>К оплате (С_к&nbsp;оплате)</td>
                <td>{formatCurrency(result.finalCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Analytics;
