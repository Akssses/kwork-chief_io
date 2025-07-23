"use client";

import s from "./TestFom.module.scss";

export default function TestFrom() {
  return (
    <div className={s.container}>
      <div className={s.left}>
        <img className={s.logo} src="/assets/icons/logo.svg" alt="" />
        <div className={s.teacherImage}>
          <img src="/assets/images/teacher2.png" alt="" />
        </div>
        <h1>Привет, вы попали в систему Tesla Education Quiz</h1>
        <p>Коротко о правилах – Не знаете ответа, не отвечайте! :)</p>
      </div>

      <form className={s.right}>
        <div className={s.testingContainer}>
          <div className={s.subject}>Математика РО</div>
          <div className={s.test}>
            <div className={s.question}>
              <p>Найдите значение выражения:</p>
              <img
                src="/assets/images/example.png"
                alt="Математический пример"
              />
            </div>

            <div className={s.answers}>
              {[1, 2, 3, 4].map((_, idx) => (
                <label key={idx} className={s.answer}>
                  <input type="radio" name="answer" />
                  <img src="/assets/images/answer.png" alt="Ответ" />
                </label>
              ))}
            </div>
          </div>
          <div className={s.test}>
            <div className={s.question}>
              <p>Найдите значение выражения:</p>
              <img
                src="/assets/images/example.png"
                alt="Математический пример"
              />
            </div>

            <div className={s.answers}>
              {[1, 2, 3, 4].map((_, idx) => (
                <label key={idx} className={s.answer}>
                  <input type="radio" name="answer" />
                  <img src="/assets/images/answer.png" alt="Ответ" />
                </label>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className={s.button}>
          Готово
        </button>
      </form>
    </div>
  );
}
