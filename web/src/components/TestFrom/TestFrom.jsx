"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import s from "./TestFom.module.scss";
import useQuestions from "@/hooks/useQuestions";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://enttest.site";

export default function TestFrom({
  subjectSetId, // ← сюда приходит id набора направлений
  lang = "ru",
  directionTitle, // для вычисления проф. предметов и отображения
  user,
  onFinish,
}) {
  const {
    data: subjects = [],
    loading,
    error,
  } = useQuestions({ subjectSetId, lang });

  // Ключ для хранения выбранных ответов зависит от subjectSetId
  const chosenKey = useMemo(
    () =>
      subjectSetId ? `quiz-chosen-${subjectSetId}` : `quiz-chosen-unknown`,
    [subjectSetId]
  );

  // Флаг, чтобы понять, что мы уже загрузили "chosen" из LS и можно безопасно сохранять изменения
  const loadedChosenRef = useRef(false);

  // 1) Инициализация выбранных ответов из localStorage
  const [chosen, setChosen] = useState(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem(chosenKey) : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // 2) Если subjectSetId поменялся — перезагрузим ответы для нового набора
  useEffect(() => {
    try {
      const raw = localStorage.getItem(chosenKey);
      setChosen(raw ? JSON.parse(raw) : {});
    } catch {
      setChosen({});
    }
    loadedChosenRef.current = true;
  }, [chosenKey]);

  // 3) Сохраняем выбранные ответы при изменениях
  useEffect(() => {
    if (!loadedChosenRef.current) return;
    try {
      localStorage.setItem(chosenKey, JSON.stringify(chosen));
    } catch (_) {}
  }, [chosen, chosenKey]);

  const allQuestions = useMemo(
    () => subjects.flatMap((s) => s.questions || []),
    [subjects]
  );

  const handleChoose = (qId, aId) =>
    setChosen((prev) => ({ ...prev, [qId]: aId }));

  const correctBySubjectTitle = (title) => {
    const subj = subjects.find(
      (s) => s.title.toLowerCase() === title.toLowerCase()
    );
    if (!subj || !subj.questions) return 0;
    let cnt = 0;
    subj.questions.forEach((q) => {
      const picked = chosen[q.id];
      const ans = (q.answers || []).find((a) => a.id === picked);
      if (ans?.is_correct) cnt += 1;
    });
    return cnt;
  };

  const scoreByPattern = (regex) => {
    let sum = 0;
    subjects.forEach((s) => {
      if (regex.test(s.title)) sum += correctBySubjectTitle(s.title);
    });
    return sum;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectSetId) {
      alert("Не передан subject_set (ID набора направлений).");
      return;
    }

    const [prof1 = "", prof2 = ""] = (directionTitle || "").split(/\s*\+\s*/);

    const profile_subject_1_score = prof1 ? correctBySubjectTitle(prof1) : 0;
    const profile_subject_2_score = prof2 ? correctBySubjectTitle(prof2) : 0;

    const history_score = scoreByPattern(/истори/i);
    const math_literacy_score = scoreByPattern(/математическ.*грамот/i);
    const reading_literacy_score = scoreByPattern(/читател|reading/i);

    const score =
      history_score +
      math_literacy_score +
      reading_literacy_score +
      profile_subject_1_score +
      profile_subject_2_score;

    // ⬇️ Отправляем subject_set
    const payload = {
      parent_name: user?.parentName || "",
      student_name: user?.name || "",
      phone_number: user?.phone || "",
      language: lang, // "ru" | "kz"
      history_score,
      math_literacy_score,
      reading_literacy_score,
      profile_subject_1_name: prof1 || "",
      profile_subject_1_score,
      profile_subject_2_name: prof2 || "",
      profile_subject_2_score,
      subject_set: Number(subjectSetId),
      score,
    };

    try {
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
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

      console.log("RESULT SENT:", payload);

      // После успешной отправки — подчистим выбранные ответы для этого набора
      try {
        localStorage.removeItem(chosenKey);
      } catch (_) {}

      onFinish?.(payload);
    } catch (err) {
      alert(`Не удалось отправить результат: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.left}>
        <img className={s.logo} src="/assets/icons/logo.png" alt="" />
        <div className={s.teacherImage}>
          <img src="/assets/images/teacher2.png" alt="" />
        </div>
        <h1>Привет, вы попали в систему Jiyrma</h1>
        <p>Коротко о правилах – Не знаете ответа, не отвечайте! :)</p>
      </div>

      <form className={s.right} onSubmit={handleSubmit}>
        <div className={s.testingContainer}>
          {loading && <div className={s.loading}>Загрузка вопросов…</div>}
          {error && <div className={s.error}>Не удалось загрузить вопросы</div>}
          {!loading && !error && subjects.length === 0 && (
            <div className={s.empty}>Нет данных по данному направлению</div>
          )}

          {!loading &&
            !error &&
            subjects.map((subject) => (
              <div key={subject.id} className={s.subjectBlock}>
                <div className={s.subject}>
                  {subject.title} ({subject.subject_type})
                </div>

                {(subject.questions || []).length === 0 && (
                  <div className={s.emptySmall}>
                    По предмету пока нет вопросов
                  </div>
                )}

                {(subject.questions || []).map((q) => (
                  <div key={q.id} className={s.test}>
                    <div className={s.question}>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: (q.text || "").replace(/\r?\n/g, "<br/>"),
                        }}
                      />
                      {q.image && (
                        <img
                          src={`https://enttest.site${q.image}`}
                          alt="Иллюстрация к вопросу"
                        />
                      )}
                    </div>

                    <div className={s.answers}>
                      {(q.answers || []).map((a) => (
                        <label key={a.id} className={s.answer}>
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={chosen[q.id] === a.id}
                            onChange={() => handleChoose(q.id, a.id)}
                          />
                          {a.image ? (
                            <img
                              src={`https://enttest.site${a.image}`}
                              alt="Вариант ответа"
                            />
                          ) : (
                            <span className={s.answerText}>{a.text}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>

        <button
          type="submit"
          className={s.button}
          disabled={loading || allQuestions.length === 0 || !subjectSetId}
        >
          Готово
        </button>
      </form>
    </div>
  );
}
