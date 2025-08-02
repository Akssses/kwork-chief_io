"use client";

import { useState } from "react";
import s from "./AuthForm.module.scss";
import { FaUser } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import useSubject from "@/hooks/useSubject";

export default function AuthForm({ onStart = () => {} }) {
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [parentName, setParentName] = useState("");
  const [directionTitle, setDirectionTitle] = useState("");
  const [directionId, setDirectionId] = useState(null);
  const [agree, setAgree] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [testLang, setTestLang] = useState("ru");

  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    const isValid = isValidKZPhone(value);
    setIsPhoneValid(isValid || value.trim() === "");
  };

  const digitsOnly = (v) => v.replace(/\D/g, "");

  const normalizeKZ = (input) => {
    const d = digitsOnly(input);
    if (d.length === 11 && d[0] === "8") return "7" + d.slice(1);
    return d;
  };

  const isValidKZPhone = (input) => {
    const n = normalizeKZ(input);
    return n.length === 11 && n[0] === "7" && n[1] === "7";
  };

  const formatKZ = (input) => {
    const n = normalizeKZ(input);
    if (n.length !== 11) return input;
    return `+7 ${n.slice(1, 4)} ${n.slice(4, 7)}-${n.slice(7, 9)}-${n.slice(
      9,
      11
    )}`;
  };

  const { items: subjectSets, loading, error } = useSubject();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) return alert("Вы должны согласиться с условиями");
    if (!directionId) return alert("Выберите направление");

    onStart({
      name: studentName, // student_name
      phone, // phone_number
      parentName, // parent_name
      directionId, // для загрузки вопросов
      directionTitle, // например "Математика + Физика"
      testLanguage: testLang, // "ru" | "kz"
    });
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
              placeholder="Ваше имя (ученика)"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>

          <div className={s.inputWrapper}>
            <span>
              <FaPhoneAlt />
            </span>
            <input
              type="tel"
              placeholder="+7 7XX XXX-XX-XX"
              value={phone}
              onChange={handlePhoneChange}
              inputMode="tel"
              className={!isPhoneValid ? s.invalidInput : ""}
              required
            />
          </div>
          {!isPhoneValid && (
            <div className={s.errorText}>
              Введите корректный номер КЗ (+7 7XX XXX-XX-XX)
            </div>
          )}

          <div className={s.inputWrapper}>
            <span>
              <HiUsers />
            </span>
            <input
              type="text"
              placeholder="ФИО Родителя"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={s.napravlenie}>
          <h2>Выберите направление:</h2>

          <div className={s.dropdownWrapper}>
            <div
              className={s.dropdownHeader}
              onClick={() => !loading && setIsDropdownOpen(!isDropdownOpen)}
              aria-disabled={loading}
            >
              {directionTitle || (loading ? "Загрузка..." : "Направление")}
              <span>
                <IoIosArrowDown />
              </span>
            </div>

            {isDropdownOpen && (
              <ul className={s.dropdownList}>
                {error && (
                  <li className={s.errorItem}>
                    Не удалось загрузить направления
                  </li>
                )}
                {!error && !loading && subjectSets.length === 0 && (
                  <li className={s.emptyItem}>Пусто</li>
                )}
                {!error &&
                  !loading &&
                  subjectSets.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setDirectionTitle(item.title);
                        setDirectionId(item.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {item.title}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className={s.lang}>
            <h2>Язык теста:</h2>
            <div
              className={s.langSwitcher}
              role="tablist"
              aria-label="Выбор языка теста"
            >
              <button
                type="button"
                role="tab"
                aria-selected={testLang === "ru"}
                className={`${s.langBtn} ${testLang === "ru" ? s.active : ""}`}
                onClick={() => setTestLang("ru")}
              >
                RU
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={testLang === "kz"}
                className={`${s.langBtn} ${testLang === "kz" ? s.active : ""}`}
                onClick={() => setTestLang("kz")}
              >
                KZ
              </button>
            </div>
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

        <button type="submit" className={s.button} disabled={loading}>
          Приступить
        </button>
      </form>
    </div>
  );
}
