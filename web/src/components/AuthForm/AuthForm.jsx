"use client";

import { useState } from "react";
import s from "./AuthForm.module.scss";
import { FaUser } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function AuthForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [direction, setDirection] = useState("");
  const [agree, setAgree] = useState(false);

  const directions = ["Математика ПО", "Геометрия", "Алгебра"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) return alert("Вы должны согласиться с условиями");
    console.log({ name, phone, email, direction });
  };

  return (
    <div className={s.container}>
      <div className={s.left}>
        <img className={s.logo} src="/assets/icons/logo.svg" alt="" />
        <div className={s.teacherImage}>
          <img src="/assets/images/teacher1.png" alt="" />
        </div>
        <h1>Привет, вы попали в систему Tesla Education Quiz</h1>
        <p>Коротко о правилах – Не знаете ответа, не отвечайте! :)</p>
      </div>

      <form className={s.right} onSubmit={handleSubmit}>
        <h2>Расскажите нам о себе</h2>

        <div className={s.inputWrapper}>
          <span>
            <FaUser />
          </span>
          <input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={s.inputWrapper}>
          <span>
            <FaPhoneAlt />
          </span>
          <input
            type="tel"
            placeholder="Ваш телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={s.inputWrapper}>
          <span>
            <MdEmail />
          </span>
          <input
            type="email"
            placeholder="Ваш e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label className={s.checkbox}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>
            Я согласен(а) с условиями хранения и обработки персональных данных
          </span>
        </label>

        <button type="submit" className={s.button}>
          Приступить
        </button>

        <a href="#" className={s.resultsLink}>
          Посмотреть результаты
        </a>
      </form>
    </div>
  );
}
