"use client";

import { useMemo, useState } from "react";
import styles from "@/styles/TeslaQuizForm.module.scss";
import ThankYouScreen from "@/components/ThankYouScreen/ThankYouScreen";
import useSubject from "@/hooks/useSubject";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const MAX = {
  history: 15,
  mathLit: 15,
  reading: 20,
  profile: 45,
  total: 140,
};

export default function TeslaQuizForm() {
  const {
    items: subjectSets,
    loading: dirsLoading,
    error: dirsError,
  } = useSubject();

  // Общие данные
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState(""); // ← NEW
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [lang] = useState("ru");

  // Направление
  const [directionTitle, setDirectionTitle] = useState("");

  // Баллы
  const [historyScore, setHistoryScore] = useState("");
  const [mathLitScore, setMathLitScore] = useState("");
  const [readingScore, setReadingScore] = useState("");
  const [prof1Score, setProf1Score] = useState("");
  const [prof2Score, setProf2Score] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // Профили (только отображение, без выбора)
  const [prof1Name, prof2Name] = useMemo(() => {
    if (!directionTitle) return ["", ""];
    const [p1 = "", p2 = ""] = directionTitle
      .split(/\s*\+\s*/)
      .map((s) => s.trim());
    return [p1, p2];
  }, [directionTitle]);

  // utils
  const cleanNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const clamp = (v, max) => String(Math.max(0, Math.min(max, Number(v) || 0)));

  const total = useMemo(
    () =>
      cleanNum(historyScore) +
      cleanNum(mathLitScore) +
      cleanNum(readingScore) +
      cleanNum(prof1Score) +
      cleanNum(prof2Score),
    [historyScore, mathLitScore, readingScore, prof1Score, prof2Score]
  );

  const validate = () => {
    if (!studentName.trim()) return "Введите имя ученика";
    if (!parentName.trim()) return "Введите ФИО родителя"; // ← NEW
    if (!phone.trim()) return "Введите телефон";
    if (!directionTitle) return "Выберите направление";
    if (!prof1Name || !prof2Name)
      return "Направление должно содержать два профильных предмета";
    if (!agree) return "Нужно согласиться с условиями";

    if (cleanNum(historyScore) > MAX.history)
      return "История Казахстана: максимум 15";
    if (cleanNum(mathLitScore) > MAX.mathLit)
      return "Математическая грамотность: максимум 15";
    if (cleanNum(readingScore) > MAX.reading)
      return "Грамотность чтения: максимум 20";
    if (cleanNum(prof1Score) > MAX.profile) return "Профильный №1: максимум 45";
    if (cleanNum(prof2Score) > MAX.profile) return "Профильный №2: максимум 45";

    if (total > MAX.total) return "Сумма баллов не должна превышать 140";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    const err = validate();
    if (err) {
      setErrMsg(err);
      return;
    }

    const payload = {
      parent_name: parentName.trim(), // ← NEW
      student_name: studentName.trim(),
      phone_number: phone.trim(),
      language: lang,
      history_score: cleanNum(historyScore),
      math_literacy_score: cleanNum(mathLitScore),
      reading_literacy_score: cleanNum(readingScore),
      profile_subject_1_name: prof1Name,
      profile_subject_1_score: cleanNum(prof1Score),
      profile_subject_2_name: prof2Name,
      profile_subject_2_score: cleanNum(prof2Score),
      direction: directionTitle,
      score: total,
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/api/v1/student_result/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${txt}`);
      }
      setSubmitted(true);
    } catch (err) {
      setErrMsg(`Не удалось отправить данные: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted)
    return (
      <div className="container">
        <ThankYouScreen />
      </div>
    );

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.backButton}
        onClick={() => (window.location.href = "/")}
      >
        Назад на главную
      </button>

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

        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>Введите свои данные</h3>

          <div className={styles.row}>
            <input
              type="text"
              placeholder="Ваше имя"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Ваш телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* NEW: ФИО родителя */}
          <div className={styles.row}>
            <input
              type="text"
              placeholder="ФИО Родителя"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />
          </div>

          <div className={styles.row}>
            <input type="text" value="История Казахстана" readOnly />
            <input
              type="number"
              placeholder="Балл"
              min={0}
              max={MAX.history}
              value={historyScore}
              onChange={(e) =>
                setHistoryScore(clamp(e.target.value, MAX.history))
              }
            />
          </div>

          <div className={styles.row}>
            <input type="text" value="Математическая грамотность" readOnly />
            <input
              type="number"
              placeholder="Балл"
              min={0}
              max={MAX.mathLit}
              value={mathLitScore}
              onChange={(e) =>
                setMathLitScore(clamp(e.target.value, MAX.mathLit))
              }
            />
          </div>

          <div className={styles.row}>
            <input type="text" value="Грамотность чтения" readOnly />
            <input
              type="number"
              placeholder="Балл"
              min={0}
              max={MAX.reading}
              value={readingScore}
              onChange={(e) =>
                setReadingScore(clamp(e.target.value, MAX.reading))
              }
            />
          </div>

          <h3>Выбор комбинации профильных предметов</h3>
          <div className={styles.row}>
            <select
              value={directionTitle}
              onChange={(e) => setDirectionTitle(e.target.value)}
            >
              <option value="">
                {dirsLoading
                  ? "Загрузка направлений..."
                  : "Выберите направление"}
              </option>
              {dirsError && (
                <option value="">Не удалось загрузить направления</option>
              )}
              {!dirsLoading &&
                !dirsError &&
                subjectSets.map((set) => (
                  <option key={set.id} value={set.title}>
                    {set.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Профильные предметы: названия из направления (readOnly), вводим только баллы */}
          <h4>Профильный предмет №1</h4>
          <div className={styles.row}>
            <input
              type="text"
              value={prof1Name}
              readOnly
              placeholder="Профильный предмет №1"
            />
            <input
              type="number"
              placeholder="Балл"
              min={0}
              max={MAX.profile}
              value={prof1Score}
              onChange={(e) =>
                setProf1Score(clamp(e.target.value, MAX.profile))
              }
              disabled={!prof1Name}
            />
          </div>

          <h4>Профильный предмет №2</h4>
          <div className={styles.row}>
            <input
              type="text"
              value={prof2Name}
              readOnly
              placeholder="Профильный предмет №2"
            />
            <input
              type="number"
              placeholder="Балл"
              min={0}
              max={MAX.profile}
              value={prof2Score}
              onChange={(e) =>
                setProf2Score(clamp(e.target.value, MAX.profile))
              }
              disabled={!prof2Name}
            />
          </div>

          <div className={styles.footer}>
            <div className={styles.totalBox}>
              <div className={styles.totalText}>
                <span>
                  Суммарное количество <br /> возможных баллов:
                </span>
              </div>
              <div className={styles.totalScore}>
                <strong>{MAX.total}</strong>
              </div>
            </div>

            <div className={styles.agreementBox}>
              <label className={styles.agree}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                Я согласен(а) с условиями хранения и обработки персональных
                данных
              </label>

              <div className={styles.submitCol}>
                <div className={styles.currentTotal}>
                  Ваши баллы: <b>{total}</b> / {MAX.total}
                </div>

                {errMsg && <div className={styles.error}>{errMsg}</div>}

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={
                    submitting ||
                    !agree ||
                    !studentName.trim() ||
                    !parentName.trim() || // ← NEW
                    !phone.trim() ||
                    !directionTitle ||
                    total > MAX.total
                  }
                >
                  {submitting ? "Отправка..." : "Отправить данные"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
