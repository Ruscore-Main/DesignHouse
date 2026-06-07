import React, { useState, useMemo, useRef } from "react";
import styles from "./CostCalculator.module.scss";
import classNames from "classnames";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ─────────────────────────────────────────────────────────────────────────────
// Справочники цен (₽)
// ─────────────────────────────────────────────────────────────────────────────

const BEARING_WALL = {
  durisol:  { label: "Дюрисол",                   pricePerM2: 3800 },
  eps:      { label: "Пенополистирол (SIP)",       pricePerM2: 3200 },
  aerated:  { label: "Газобетон (1 блок)",         pricePerM2: 4500 },
  brick1:   { label: "Кирпич (1 кирпич)",          pricePerM2: 6500 },
  brick15:  { label: "Кирпич (1.5 кирпича)",       pricePerM2: 8000 },
  brick2:   { label: "Кирпич (2 кирпича)",         pricePerM2: 9500 },
  lstk:     { label: "ЛСТК (металлокаркас)",       pricePerM2: 4200 },
  ceramic:  { label: "Керамоблок",                 pricePerM2: 8500 },
} as const;

const EXTERIOR_FINISH = {
  facingBrick: { label: "Облицовочный кирпич",              pricePerM2: 3500 },
  plaster:     { label: "Штукатурка",                       pricePerM2: 1200 },
  textPlaster: { label: "Структурная штукатурка + окраска", pricePerM2: 1800 },
  stone:       { label: "Дикий камень",                     pricePerM2: 4500 },
  siding:      { label: "Сайдинг",                          pricePerM2:  900 },
} as const;

const FOUNDATION = {
  pile:  { label: "Буронабивной (свайно-ростверковый)", isArea: false, pricePerM:  12000 },
  strip: { label: "Ленточный монолитный",                isArea: false, pricePerM:  18000 },
  fbs:   { label: "Цокольный этаж (блоки ФБС)",          isArea: false, pricePerM:  35000 },
  slab:  { label: "Монолитная плита",                    isArea: true,  pricePerM2:  5000 },
} as const;

const CEILING = {
  wood:      { label: "Деревянные",             pricePerM2: 2500 },
  metalWood: { label: "Мет. балка + дерево",    pricePerM2: 3200 },
  precast:   { label: "Сборные ж/б плиты",      pricePerM2: 3800 },
  monolith:  { label: "Монолитное перекрытие",  pricePerM2: 4500 },
} as const;

const GROUND_FLOOR = {
  wood:     { label: "Деревянный пол",         pricePerM2: 2800 },
  concrete: { label: "Бетонный пол по грунту", pricePerM2: 3500 },
} as const;

const ROOF = {
  metal: { label: "Металлочерепица", pricePerM2: 2200 },
  soft:  { label: "Мягкая кровля",   pricePerM2: 3500 },
} as const;

const STAIRCASE = {
  wood:     { label: "Деревянная",     price: 120000 },
  concrete: { label: "Железобетонная", price: 200000 },
} as const;

const INTERIOR_FINISH = {
  none:    { label: "Нет",                pricePerM2:     0 },
  rough:   { label: "Черновая отделка",   pricePerM2:  5000 },
  turnkey: { label: "Ремонт «под ключ»",  pricePerM2: 12000 },
} as const;

const DRAINAGE_PER_M      = 1500;
const PARTITIONS_PER_M2   = 1500;
const WINDOWS_DOORS_PER_M2 = 3500;
const SCREED_PER_M2       =  800;
const PLASTER_INT_PER_M2  =  600;
const PUTTY_PER_M2        =  400;
const FLOOR_K: Record<number, number> = { 1: 1.00, 2: 1.05, 3: 1.08 };

type BearingWallKey    = keyof typeof BEARING_WALL;
type ExteriorFinishKey = keyof typeof EXTERIOR_FINISH;
type FoundationKey     = keyof typeof FOUNDATION;
type CeilingKey        = keyof typeof CEILING;
type GroundFloorKey    = keyof typeof GROUND_FLOOR;
type RoofKey           = keyof typeof ROOF;
type StaircaseKey      = keyof typeof STAIRCASE;
type InteriorFinishKey = keyof typeof INTERIOR_FINISH;

interface Params {
  width:           number;
  length:          number;
  floors:          1 | 2 | 3;
  hasMansard:      boolean;
  hasBasement:     boolean;
  basementHeight:  number;
  floorHeight:     number;
  ridgeHeight:     number;
  bearingWall:     BearingWallKey;
  exteriorFinish:  ExteriorFinishKey;
  foundation:      FoundationKey;
  ceiling:         CeilingKey;
  hasPartitions:   boolean;
  groundFloor:     GroundFloorKey;
  roof:            RoofKey;
  hasDrainage:     boolean;
  staircase:       StaircaseKey;
  hasWindowsDoors: boolean;
  interiorFinish:  InteriorFinishKey;
  hasScreed:       boolean;
  hasPlasterInt:   boolean;
  hasPutty:        boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

// ─────────────────────────────────────────────────────────────────────────────
// Вспомогательные UI-компоненты
// ─────────────────────────────────────────────────────────────────────────────

interface BtnGroupProps<T extends string> {
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}
function BtnGroup<T extends string>({ value, options, onChange }: BtnGroupProps<T>) {
  return (
    <div className={styles.btnGroup}>
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={classNames(styles.btn, { [styles.btnActive]: value === key })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

interface RadioCardsProps<T extends string> {
  name: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}
function RadioCards<T extends string>({ name, value, options, onChange }: RadioCardsProps<T>) {
  return (
    <div className={styles.radioGroup}>
      {options.map(({ key, label }) => (
        <label key={key} className={classNames(styles.radio, { [styles.radioActive]: value === key })}>
          <input type="radio" name={name} value={key} checked={value === key} onChange={() => onChange(key)} />
          {label}
        </label>
      ))}
    </div>
  );
}

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}
function Toggle({ value, onChange }: ToggleProps) {
  return (
    <div className={styles.btnGroup}>
      <button onClick={() => onChange(true)}  className={classNames(styles.btn, { [styles.btnActive]:  value })}>Да</button>
      <button onClick={() => onChange(false)} className={classNames(styles.btn, { [styles.btnActive]: !value })}>Нет</button>
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}
function SliderField({ label, value, min, max, step, unit, onChange }: SliderFieldProps) {
  return (
    <div className={styles.field}>
      <label>{label}: <strong>{value} {unit}</strong></label>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className={styles.slider}
      />
      <div className={styles.rangeLabels}><span>{min} {unit}</span><span>{max} {unit}</span></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Главный компонент
// ─────────────────────────────────────────────────────────────────────────────

const CostCalculator: React.FC = () => {
  const [p, setP] = useState<Params>({
    width: 10, length: 12, floors: 1,
    hasMansard: false, hasBasement: false,
    basementHeight: 0.5, floorHeight: 2.7, ridgeHeight: 3.0,
    bearingWall: "aerated", exteriorFinish: "plaster",
    foundation: "strip", ceiling: "wood",
    hasPartitions: true, groundFloor: "concrete",
    roof: "metal", hasDrainage: false,
    staircase: "wood", hasWindowsDoors: true,
    interiorFinish: "rough",
    hasScreed: false, hasPlasterInt: false, hasPutty: false,
  });

  const set = <K extends keyof Params>(key: K, val: Params[K]) =>
    setP((prev) => ({ ...prev, [key]: val }));

  const rightColRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async () => {
    const el = rightColRef.current;
    if (!el) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        // скрываем кнопку и блок формул при захвате
        ignoreElements: (node) =>
          node.classList.contains(styles.pdfBar) ||
          (node as HTMLElement).dataset.noPdf === "true",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW  = pdf.internal.pageSize.getWidth();
      const pageH  = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;
      // итоговая высота изображения в мм при ширине contentW
      const imgH = (canvas.height * contentW) / canvas.width;
      const totalPages = Math.ceil(imgH / contentH);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();
        // сдвигаем картинку вверх на высоту уже напечатанных страниц;
        // jsPDF автоматически обрезает всё, что выходит за границы листа
        pdf.addImage(imgData, "PNG", margin, margin - page * contentH, contentW, imgH);
      }

      pdf.save(`смета-строительства-${p.width}x${p.length}м.pdf`);
    } finally {
      setExporting(false);
    }
  };

  // ── Геометрия ──────────────────────────────────────────────────────────────
  const geo = useMemo(() => {
    const { width: W, length: L, floors: n, hasMansard, hasBasement, basementHeight: Hb, floorHeight: Hf, ridgeHeight: Hr } = p;

    const perimeter        = 2 * (W + L);                         // P = 2(W+L)
    const baseArea         = W * L;                                // S_осн = W×L
    const wallsHeight      = Hf * n;                               // h_стен = Hf×n
    const extWallArea      = perimeter * wallsHeight;              // S_стен = P × h_стен
    const mansardArea      = hasMansard ? Math.round(baseArea * 0.7) : 0;
    const totalArea        = baseArea * n + mansardArea;           // S_общ = S×n + S_манс
    const basementArea     = hasBasement ? perimeter * Hb : 0;    // S_цок = P × Hb
    const gableArea        = W * Hr / 2;                           // S_фронт = W×Hr/2 (оба фронтона)
    const slopeLen         = Math.sqrt(Math.pow(W / 2, 2) + Math.pow(Hr, 2));
    const roofArea         = 2 * slopeLen * L;                     // S_кр = 2×slope×L

    return {
      perimeter:    round1(perimeter),
      baseArea:     Math.round(baseArea),
      wallsHeight:  round1(wallsHeight),
      extWallArea:  Math.round(extWallArea),
      mansardArea,
      totalArea:    Math.round(totalArea),
      basementArea: Math.round(basementArea),
      gableArea:    Math.round(gableArea),
      slopeLen:     round2(slopeLen),
      roofArea:     Math.round(roofArea),
    };
  }, [p]);

  // ── Стоимость ──────────────────────────────────────────────────────────────
  const cost = useMemo(() => {
    const { floors: n, foundation, bearingWall, exteriorFinish, ceiling, hasPartitions,
            groundFloor, roof, hasDrainage, staircase, hasWindowsDoors, interiorFinish,
            hasScreed, hasPlasterInt, hasPutty } = p;
    const { perimeter, baseArea, extWallArea, totalArea, roofArea } = geo;

    const fd    = FOUNDATION[foundation];
    const cFund = fd.isArea
      ? baseArea   * (fd as { pricePerM2: number; isArea: true }).pricePerM2
      : perimeter  * (fd as { pricePerM:  number; isArea: false }).pricePerM;

    const cWalls    = extWallArea * BEARING_WALL[bearingWall].pricePerM2;
    const cExtFin   = extWallArea * EXTERIOR_FINISH[exteriorFinish].pricePerM2;
    const cCeiling  = totalArea   * CEILING[ceiling].pricePerM2;
    const cPartit   = hasPartitions   ? totalArea  * PARTITIONS_PER_M2    : 0;
    const cGndFloor = baseArea        * GROUND_FLOOR[groundFloor].pricePerM2;
    const cRoof     = roofArea        * ROOF[roof].pricePerM2;
    const cDrain    = hasDrainage     ? perimeter  * DRAINAGE_PER_M       : 0;
    const cStair    = n > 1           ? STAIRCASE[staircase].price        : 0;
    const cWinDoor  = hasWindowsDoors ? totalArea  * WINDOWS_DOORS_PER_M2 : 0;
    const cIntFin   = totalArea       * INTERIOR_FINISH[interiorFinish].pricePerM2;
    const cScreed   = hasScreed       ? totalArea  * SCREED_PER_M2        : 0;
    const cPlastInt = hasPlasterInt   ? extWallArea * PLASTER_INT_PER_M2  : 0;
    const cPutty    = hasPutty        ? extWallArea * PUTTY_PER_M2        : 0;

    const kN      = FLOOR_K[n];
    const subtotal = cFund + cWalls + cExtFin + cCeiling + cPartit + cGndFloor +
                     cRoof + cDrain + cStair + cWinDoor + cIntFin + cScreed + cPlastInt + cPutty;
    const total    = Math.round(subtotal * kN);

    return {
      cFund:    Math.round(cFund),
      cWalls:   Math.round(cWalls),
      cExtFin:  Math.round(cExtFin),
      cCeiling: Math.round(cCeiling),
      cPartit:  Math.round(cPartit),
      cGndFloor:Math.round(cGndFloor),
      cRoof:    Math.round(cRoof),
      cDrain:   Math.round(cDrain),
      cStair:   Math.round(cStair),
      cWinDoor: Math.round(cWinDoor),
      cIntFin:  Math.round(cIntFin),
      cScreed:  Math.round(cScreed),
      cPlastInt:Math.round(cPlastInt),
      cPutty:   Math.round(cPutty),
      kN, subtotal: Math.round(subtotal), total,
    };
  }, [p, geo]);

  // ── Рендер ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.calculator}>
      <h2 className={styles.title}>Калькулятор стоимости строительства дома</h2>
      <p className={styles.subtitle}>
        Расчёт носит ориентировочный характер. Стоимость участка не учитывается.
        Итоговая цена зависит от сложности проекта, удалённости объекта и конъюнктуры рынка.
      </p>

      <div className={styles.grid}>

        {/* ══════════ Левая колонка: параметры ══════════ */}
        <div className={styles.leftCol}>

          {/* Исходные данные */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Исходные данные</h3>

            <SliderField label="Ширина здания"  value={p.width}  min={5}  max={30} step={1} unit="м" onChange={(v) => set("width",  v)} />
            <SliderField label="Длина здания"   value={p.length} min={5}  max={50} step={1} unit="м" onChange={(v) => set("length", v)} />

            <div className={styles.field}>
              <label>Количество этажей</label>
              <BtnGroup
                value={String(p.floors) as "1" | "2" | "3"}
                options={[{ key: "1", label: "1 этаж" }, { key: "2", label: "2 этажа" }, { key: "3", label: "3 этажа" }]}
                onChange={(v) => set("floors", +v as 1 | 2 | 3)}
              />
            </div>

            <div className={styles.inlineFields}>
              <div className={styles.field}>
                <label>Мансарда</label>
                <Toggle value={p.hasMansard} onChange={(v) => set("hasMansard", v)} />
              </div>
              <div className={styles.field}>
                <label>Цокольный этаж</label>
                <Toggle value={p.hasBasement} onChange={(v) => set("hasBasement", v)} />
              </div>
            </div>

            {p.hasBasement && (
              <SliderField label="Высота цоколя" value={p.basementHeight} min={0.3} max={2.0} step={0.1} unit="м" onChange={(v) => set("basementHeight", v)} />
            )}
            <SliderField label="Высота этажа"  value={p.floorHeight}   min={2.5} max={4.0} step={0.1} unit="м" onChange={(v) => set("floorHeight",   v)} />
            <SliderField label="Высота конька" value={p.ridgeHeight}   min={1.5} max={6.0} step={0.5} unit="м" onChange={(v) => set("ridgeHeight",   v)} />
          </section>

          {/* Несущие конструкции */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Несущие конструкции и отделка</h3>

            <div className={styles.field}>
              <label>Несущие стены</label>
              <RadioCards
                name="bearingWall"
                value={p.bearingWall}
                options={Object.entries(BEARING_WALL).map(([k, v]) => ({ key: k as BearingWallKey, label: v.label }))}
                onChange={(v) => set("bearingWall", v)}
              />
            </div>

            <div className={styles.field}>
              <label>Наружная отделка</label>
              <RadioCards
                name="exteriorFinish"
                value={p.exteriorFinish}
                options={Object.entries(EXTERIOR_FINISH).map(([k, v]) => ({ key: k as ExteriorFinishKey, label: v.label }))}
                onChange={(v) => set("exteriorFinish", v)}
              />
            </div>

            <div className={styles.field}>
              <label>Тип фундамента</label>
              <RadioCards
                name="foundation"
                value={p.foundation}
                options={Object.entries(FOUNDATION).map(([k, v]) => ({ key: k as FoundationKey, label: v.label }))}
                onChange={(v) => set("foundation", v)}
              />
            </div>
          </section>

          {/* Перекрытия и кровля */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Перекрытия, кровля и полы</h3>

            <div className={styles.field}>
              <label>Перекрытия</label>
              <RadioCards
                name="ceiling"
                value={p.ceiling}
                options={Object.entries(CEILING).map(([k, v]) => ({ key: k as CeilingKey, label: v.label }))}
                onChange={(v) => set("ceiling", v)}
              />
            </div>

            <div className={styles.field}>
              <label>Полы 1-го этажа</label>
              <BtnGroup
                value={p.groundFloor}
                options={Object.entries(GROUND_FLOOR).map(([k, v]) => ({ key: k as GroundFloorKey, label: v.label }))}
                onChange={(v) => set("groundFloor", v)}
              />
            </div>

            <div className={styles.field}>
              <label>Кровля</label>
              <BtnGroup
                value={p.roof}
                options={Object.entries(ROOF).map(([k, v]) => ({ key: k as RoofKey, label: v.label }))}
                onChange={(v) => set("roof", v)}
              />
            </div>

            <div className={styles.field}>
              <label>Водосточная система</label>
              <Toggle value={p.hasDrainage} onChange={(v) => set("hasDrainage", v)} />
            </div>
          </section>

          {/* Дополнительно */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Дополнительные работы</h3>

            {p.floors > 1 && (
              <div className={styles.field}>
                <label>Лестница</label>
                <BtnGroup
                  value={p.staircase}
                  options={Object.entries(STAIRCASE).map(([k, v]) => ({ key: k as StaircaseKey, label: v.label }))}
                  onChange={(v) => set("staircase", v)}
                />
              </div>
            )}

            <div className={styles.inlineFields}>
              <div className={styles.field}>
                <label>Окна + металл. двери</label>
                <Toggle value={p.hasWindowsDoors} onChange={(v) => set("hasWindowsDoors", v)} />
              </div>
              <div className={styles.field}>
                <label>Внутр. перегородки</label>
                <Toggle value={p.hasPartitions} onChange={(v) => set("hasPartitions", v)} />
              </div>
            </div>

            <div className={styles.field}>
              <label>Внутренняя отделка</label>
              <RadioCards
                name="interiorFinish"
                value={p.interiorFinish}
                options={Object.entries(INTERIOR_FINISH).map(([k, v]) => ({ key: k as InteriorFinishKey, label: v.label }))}
                onChange={(v) => set("interiorFinish", v)}
              />
            </div>

            <div className={styles.checkboxRow}>
              <div className={styles.field}>
                <label>Стяжка пола</label>
                <Toggle value={p.hasScreed}     onChange={(v) => set("hasScreed",     v)} />
              </div>
              <div className={styles.field}>
                <label>Штукатурка (внутр.)</label>
                <Toggle value={p.hasPlasterInt} onChange={(v) => set("hasPlasterInt", v)} />
              </div>
              <div className={styles.field}>
                <label>Шпаклёвка</label>
                <Toggle value={p.hasPutty}      onChange={(v) => set("hasPutty",      v)} />
              </div>
            </div>
          </section>
        </div>

        {/* ══════════ Правая колонка: результаты ══════════ */}
        <div className={styles.rightCol} ref={rightColRef}>

          <div className={styles.pdfBar}>
            <button
              onClick={exportToPDF}
              disabled={exporting}
              className={styles.pdfBtn}
            >
              {exporting ? "Генерация…" : "Скачать PDF"}
            </button>
          </div>

          {/* Расчётные параметры */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Рассчитанные параметры</h3>
            <div className={styles.paramTable}>
              <ParamRow label="Периметр здания (P)"                   value={`${geo.perimeter} м`}    />
              <ParamRow label="Несущие стены (длина)"                 value={`${geo.perimeter} м`}    />
              <ParamRow label="Площадь основания (S)"                 value={`${geo.baseArea} м²`}    />
              {p.hasMansard && <ParamRow label="Площадь мансардного эт." value={`${geo.mansardArea} м²`} />}
              <ParamRow label="Общая площадь дома (S_общ)"            value={`${geo.totalArea} м²`}   />
              {p.hasBasement && <ParamRow label="Площадь облицовки цоколя" value={`${geo.basementArea} м²`} />}
              <ParamRow label="Площадь фронтонов (S_фр)"             value={`${geo.gableArea} м²`}   />
              <ParamRow label="Площадь кровли (S_кр)"                value={`${geo.roofArea} м²`}    />
              <ParamRow label="Площадь внешних стен (S_ст)"          value={`${geo.extWallArea} м²`} />
            </div>
          </section>

          {/* Стоимость по разделам */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Стоимость по разделам</h3>
            <div className={styles.costTable}>
              <CostRow label="Фундамент"                     value={cost.cFund}     />
              <CostRow label="Несущие стены"                 value={cost.cWalls}    />
              <CostRow label="Наружная отделка"              value={cost.cExtFin}   />
              <CostRow label="Перекрытия"                    value={cost.cCeiling}  />
              <CostRow label="Полы 1-го этажа"               value={cost.cGndFloor} />
              <CostRow label="Кровля"                        value={cost.cRoof}     />
              {p.hasDrainage     && <CostRow label="Водосточная система"   value={cost.cDrain}    />}
              {p.floors > 1      && <CostRow label="Лестница"              value={cost.cStair}    />}
              {p.hasWindowsDoors && <CostRow label="Окна + металл. двери"  value={cost.cWinDoor}  />}
              {p.hasPartitions   && <CostRow label="Внутр. перегородки"    value={cost.cPartit}   />}
              {p.interiorFinish !== "none" && <CostRow label="Внутренняя отделка"  value={cost.cIntFin}  />}
              {p.hasScreed       && <CostRow label="Стяжка пола"           value={cost.cScreed}   />}
              {p.hasPlasterInt   && <CostRow label="Штукатурка (внутр.)"   value={cost.cPlastInt} />}
              {p.hasPutty        && <CostRow label="Шпаклёвка"             value={cost.cPutty}    />}
              <div className={styles.subtotalRow}>
                <span>Сумма без k<sub>n</sub></span>
                <span>{fmt(cost.subtotal)}</span>
              </div>
              <div className={styles.subtotalRow}>
                <span>Коэффициент этажности k<sub>n</sub></span>
                <span>× {cost.kN.toFixed(2)}</span>
              </div>
            </div>
            <div className={styles.total}>
              <span>Итоговая стоимость строительства</span>
              <span>{fmt(cost.total)}</span>
            </div>
          </section>

          {/* Формулы для диплома */}
          <section className={styles.section} data-no-pdf="true">
            <h3 className={styles.sectionTitle}>Расчётные формулы</h3>
            <div className={styles.formulas}>
              <p><em>P</em> = 2·(W + L) = 2·({p.width} + {p.length}) = <b>{geo.perimeter} м</b></p>
              <p><em>S<sub>осн</sub></em> = W·L = {p.width}·{p.length} = <b>{geo.baseArea} м²</b></p>
              <p><em>S<sub>стен</sub></em> = P·(H<sub>эт</sub>·n) = {geo.perimeter}·({p.floorHeight}·{p.floors}) = <b>{geo.extWallArea} м²</b></p>
              <p><em>S<sub>общ</sub></em> = S<sub>осн</sub>·n{p.hasMansard ? " + S_манс" : ""} = {geo.baseArea}·{p.floors}{p.hasMansard ? ` + ${geo.mansardArea}` : ""} = <b>{geo.totalArea} м²</b></p>
              <p><em>S<sub>фр</sub></em> = W·H<sub>к</sub>/2 = {p.width}·{p.ridgeHeight}/2 = <b>{geo.gableArea} м²</b></p>
              <p><em>l<sub>скат</sub></em> = √((W/2)² + H<sub>к</sub>²) = √({Math.pow(p.width/2,2).toFixed(1)} + {Math.pow(p.ridgeHeight,2).toFixed(1)}) = <b>{geo.slopeLen} м</b></p>
              <p><em>S<sub>кр</sub></em> = 2·l<sub>скат</sub>·L = 2·{geo.slopeLen}·{p.length} = <b>{geo.roofArea} м²</b></p>
              <div className={styles.fDivider} />
              <p><em>C<sub>итог</sub></em> = ΣC<sub>i</sub> · k<sub>n</sub> = {fmt(cost.subtotal)} · {cost.kN.toFixed(2)} = <b>{fmt(cost.total)}</b></p>
              <p className={styles.fNote}>k<sub>n</sub> — коэффициент сложности: 1.00 (1 эт.) / 1.05 (2 эт.) / 1.08 (3 эт.)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Мелкие компоненты-строки таблиц
// ─────────────────────────────────────────────────────────────────────────────

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.paramRow}>
      <span dangerouslySetInnerHTML={{ __html: label }} />
      <strong>{value}</strong>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.costRow}>
      <span>{label}</span>
      <span>{fmt(value)}</span>
    </div>
  );
}

function round1(n: number) { return Math.round(n * 10) / 10; }
function round2(n: number) { return Math.round(n * 100) / 100; }

export default CostCalculator;
