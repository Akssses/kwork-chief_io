"use client";

import { useMemo, useState } from "react";
import s from "./TestFom.module.scss";
import useQuestions from "@/hooks/useQuestions";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function TestFrom({
  subjectSetId,
  lang = "ru",
  directionTitle,
  user,
  onFinish,
}) {
  const {
    data: subjects,
    loading,
    error,
  } = useQuestions({ subjectSetId, lang });
  const [chosen, setChosen] = useState({});

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

    const [prof1 = "", prof2 = ""] = (directionTitle || "").split(/\s*\+\s*/);

    const profile_subject_1_score = prof1 ? correctBySubjectTitle(prof1) : 0;
    const profile_subject_2_score = prof2 ? correctBySubjectTitle(prof2) : 0;

    const history_score = scoreByPattern(/истори/i); // "Всемирная история" и т.п.
    const math_literacy_score = scoreByPattern(/математическ.*грамот/i); // "Математическая грамотность"
    const reading_literacy_score = scoreByPattern(/читател|reading/i); // "Читательская грамотность"

    const score =
      history_score +
      math_literacy_score +
      reading_literacy_score +
      profile_subject_1_score +
      profile_subject_2_score;

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
      direction: directionTitle || "",
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
      onFinish?.(payload);
    } catch (err) {
      alert(`Не удалось отправить результат: ${err.message}`);
      console.error(err);
    }
  };

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
                        <img src={q.image} alt="Иллюстрация к вопросу" />
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
                            <img src={a.image} alt="Вариант ответа" />
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
          disabled={loading || allQuestions.length === 0}
        >
          Готово
        </button>
      </form>
    </div>
  );
}
