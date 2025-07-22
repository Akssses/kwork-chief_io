"use client";

import { useState } from "react";
import s from "./AuthForm.module.scss";
import { FaUser } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";

export default function AuthForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [direction, setDirection] = useState("");
  const [agree, setAgree] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const directions = [
    "Математика + Физика",
    "Математика + Информатика",
    "Математика + География",
    "Химия + Биология",
    "География + Биология",
    "Химия + Физика",
    "Всемирная история + Человек. Общество. Право",
    "Всемирная история + Английский язык",
    "Всемирная история + География",
  ];

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
        <div className={s.inpuuuts}>
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
              <HiUsers />
            </span>
            <input
              type="text"
              placeholder="ФИО Родителя"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className={s.napravlenie}>
          <h2>Выберите направление:</h2>
          <div className={s.dropdownWrapper}>
            <div
              className={s.dropdownHeader}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {direction || "Направление"}
              <span>
                <IoIosArrowDown />
              </span>
            </div>
            {isDropdownOpen && (
              <ul className={s.dropdownList}>
                {directions.map((item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setDirection(item);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
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
        </div>

        <button type="submit" className={s.button}>
          Приступить
        </button>
      </form>
    </div>
  );
}
