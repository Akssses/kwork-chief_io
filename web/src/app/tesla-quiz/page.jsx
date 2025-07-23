"use client";

import styles from "@/styles/TeslaQuizForm.module.scss";

export default function TeslaQuizForm() {
  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton}>Назад на главную</button>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <img src="/assets/icons/logo.svg" alt="Tesla Education" />
            <h1>
              Привет, вы попали в систему <br /> Tesla Education Quiz
            </h1>
            <p>Коротко о правилах - Не знаете ответа, не отвечайте! :)</p>
          </div>
          <img
            className={styles.character}
            src="/assets/images/teacher3.png"
            alt="Teacher"
          />
        </div>

        <form className={styles.form}>
          <h3>Введите свои данные</h3>
          <div className={styles.row}>
            <input type="text" placeholder="Ваше имя" />
            <input type="text" placeholder="Ваш телефон" />
          </div>

          <div className={styles.row}>
            <input type="text" placeholder="История Казахстана" />
            <input type="number" placeholder="Балл" />
          </div>

          <div className={styles.row}>
            <input type="text" placeholder="Математическая грамотность" />
            <input type="number" placeholder="Балл" />
          </div>

          <div className={styles.row}>
            <input type="text" placeholder="Грамотность чтения" />
            <input type="number" placeholder="Балл" />
          </div>

          <h3>Выбор комбинации профильных предметов</h3>
          <div className={styles.row}>
            <select>
              <option>Выберите направление</option>
            </select>
          </div>

          <h4>Профильный предмет №1</h4>
          <div className={styles.row}>
            <select>
              <option>Выберите тему</option>
            </select>
            <input type="number" placeholder="Балл" />
          </div>

          <h4>Профильный предмет №2</h4>
          <div className={styles.row}>
            <select>
              <option>Выберите тему</option>
            </select>
            <input type="number" placeholder="Балл" />
          </div>

          <div className={styles.footer}>
            <div className={styles.totalBox}>
              <div className={styles.totalText}>
                <span>
                  Суммарное количество <br /> возможных баллов:
                </span>
              </div>
              <div className={styles.totalScore}>
                <strong>140</strong>
              </div>
            </div>

            <div className={styles.agreementBox}>
              <label className={styles.agree}>
                <input type="checkbox" />Я согласен(а) с условиями хранения и
                обработки персональных данных
              </label>

              <button type="submit" className={styles.submit}>
                Отправить данные
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
