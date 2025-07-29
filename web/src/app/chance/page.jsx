"use client";

import s from "./page.module.scss";

export default function ChancesPage() {
  const rows = [
    { left: 10, name: "Электротехника и энергетика", right: 96 },
    {
      left: 5,
      name: "Стандартизация, сертификация и метрология (по отраслям)",
      right: 91,
    },
    { left: 15, name: "Механика", right: 94 },
    { left: 15, name: "Коммуникации и коммуникационные технологии", right: 94 },
  ];

  return (
    <section className={s.wrapper}>
      <div className={s.card}>
        <div className={s.hero}>
          <div className={s.heroLeft}>
            <img
              className={s.logo}
              src="/assets/icons/logo.svg"
              alt="Tesla Education"
            />
            <div>
              <h1 className={s.heroTitle}>Brain test</h1>
              <p className={s.heroSubtitle}>
                Диагностика успеваемости ученика по тесту ЕНТ
              </p>
            </div>
          </div>
          <img
            className={s.heroCharacter}
            src="/assets/images/teacher3.png"
            alt=""
          />
        </div>

        <div className={s.body}>
          <h3 className={s.sectionTitle}>
            Возможность поступить в выбранные специальности
          </h3>

          <div className={s.colsHead}>
            <span>Без подготовки</span>
            <span>С подготовкой</span>
          </div>

          <div className={s.rows}>
            {rows.map((r, i) => (
              <div className={s.row} key={i}>
                <div className={s.leftBar} style={{ ["--w"]: `${r.left}%` }}>
                  <div className={s.leftFill} />
                  <span className={s.leftVal}>{r.left}%</span>
                </div>

                <div className={s.major}>{r.name}</div>

                <div className={s.rightBar} style={{ ["--w"]: `${r.right}%` }}>
                  <div className={s.fill} />
                  <span className={s.rightVal}>{r.right}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className={s.note}>
            <div className={s.noteTitle}>Примечание:</div>
            <p>
              Не все дети могут поступить в лучшие ВУЗы страны, кому-то это
              вовсе не нужно, подготовка бывает сложной и не дает результата. По
              статистике 10,8% детей поступают без специализированной подготовки
              в лучшие ВУЗы страны, и 89,2% поступают с помощью специальной
              подготовки и правильного подхода, что включает в себя мотивацию,
              целеполагание, подготовку, наставничество и поддержку родителей,
              практику решения задач.
            </p>
          </div>

          <div className={s.infoBox}>
            <div className={s.infoLeft}>
              <div className={s.number}>10</div>
              <div className={s.caption}>месяцев у вас</div>
            </div>
            <div className={s.infoText}>
              На подготовку к поступлению в ВУЗы. При подготовке к экзаменам ЕНТ
              улучшается общий уровень успеваемости по основным и профильным
              предметам и так, как у ребенка и родителей появляется цель,
              результат будет быстрый и качественный.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
