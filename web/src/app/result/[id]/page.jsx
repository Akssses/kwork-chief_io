"use client";

import s from "./page.module.scss";

export default function ResultPage() {
  return (
    <section className={s.wrapper}>
      <div className={s.card}>
        {/* HERO */}
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

        {/* CONTENT */}
        <div className={s.body}>
          <p className={s.path}>
            Диагностика успеваемости ученика по тесту ЕНТ
          </p>

          <h2 className={s.hello}>
            <span>Салем!</span> Тортулова Назгуль
          </h2>

          <div className={s.infoRow}>
            <div className={s.infoBox}>
              <span className={s.infoLabel}>Направление:</span>
              <strong className={s.infoValue}>Математика + Физика</strong>
            </div>
            <div className={s.infoBox}>
              <span className={s.infoLabel}>Цель:</span>
              <strong className={s.infoValue}>Диагностика знаний</strong>
            </div>
            <div className={s.resultBox}>
              <span className={s.resultLabel}>Результаты тестирования</span>
              <div className={s.resultValue}>50.0%</div>
            </div>
          </div>

          <div className={s.section}>
            <h3>Диагностика</h3>
            <p className={s.description}>
              Представленная диагностика рассматривает академические способности
              ребенка на основе результатов пробного ЕНТ. Оценка проведена по
              шкале, где указано количество набранных баллов по сравнению с
              максимальной возможной. Этот подход позволяет выявить как сильные,
              так и слабые стороны в уровне подготовки к ЕНТ, что является
              ключом к разработке индивидуального плана обучения.
            </p>
          </div>

          <div className={s.scoreCard}>
            <div className={s.scoreHeader}>Основные предметы</div>

            <div className={s.mainGrid}>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>
                  Математическая
                  <br />
                  грамотность
                </div>
                <div className={s.smallScore}>12/15</div>
              </div>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>
                  История
                  <br />
                  Казахстана
                </div>
                <div className={s.smallScore}>13/15</div>
              </div>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>Грамотность чтения</div>
                <div className={s.smallScore}>15/20</div>
              </div>

              <div className={s.bigScoreBox}>
                <div className={s.bigScoreValue}>700/140</div>
                <div className={s.bigScoreLabel}>баллов</div>
              </div>
            </div>

            <div className={s.profileHeader}>Профильные предметы</div>

            <div className={s.profileGrid}>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>Математика</div>
                <div className={s.smallScore}>20/45</div>
              </div>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>Физика</div>
                <div className={s.smallScore}>15/45</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
