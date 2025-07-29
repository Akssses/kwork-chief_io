"use client";

import { useMemo, useState } from "react";
import s from "./TestFom.module.scss";
import useQuestions from "@/hooks/useQuestions";

export default function TestFrom({
  subjectSetId = 1,
  lang = "ru",
  onFinish, // опционально: что делать после отправки
}) {
  const {
    data: subjects,
    loading,
    error,
  } = useQuestions({ subjectSetId, lang });

  const [chosen, setChosen] = useState({});

  const allQuestions = useMemo(
    () => subjects.flatMap((subj) => subj.questions || []),
    [subjects]
  );

  const handleChoose = (qId, aId) => {
    setChosen((prev) => ({ ...prev, [qId]: aId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const answers = Object.entries(chosen).map(([question_id, answer_id]) => ({
      question_id: Number(question_id),
      answer_id: Number(answer_id),
    }));

    const payload = {
      subject_set_id: subjectSetId,
      lang,
      answers,
    };

    if (typeof onFinish === "function") onFinish(payload);
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

                {(subject.questions || []).map((q, i) => (
                  <div key={q.id} className={s.test}>
                    <div className={s.question}>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: q.text?.replace(/\r?\n/g, "<br/>") || "",
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
