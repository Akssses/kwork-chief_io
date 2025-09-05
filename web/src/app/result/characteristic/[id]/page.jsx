"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://admin.jiyrma-gt.kz";

const MAX = {
  math_lit: 10,
  history: 20,
  reading: 10,
  profile: 50,
  total: 140,
};

const pct = (score, max) =>
  Math.max(0, Math.min(100, Math.round(((score || 0) / max) * 100)));

const levelByPct = (p) => (p < 50 ? "low" : p <= 70 ? "mid" : "high");
const levelTitle = {
  low: "Низкий результат",
  mid: "Средний результат",
  high: "Высокий результат",
};

const TEXTS = {
  reading: {
    low: `У ученика выявлены значительные трудности с пониманием и анализом текстов различной сложности. Навыки критического чтения, определения основной мысли и интерпретации информации требуют серьёзной дополнительной проработки. Рекомендуется сосредоточиться на техниках внимательного чтения и анализе структуры текста.`,
    mid: `Ученик демонстрирует базовое понимание текстов, однако возникают сложности при работе с более комплексными заданиями, требующими глубокого анализа или выявления скрытого смысла. Для улучшения результата необходима практика в работе с разнообразными текстами и развитие навыков интерпретации.`,
    high: `Ученик показал хорошие навыки работы с текстами: понимает основную идею, детали и авторскую позицию. Способность к анализу и интерпретации информации на высоком уровне. Для развития — чтение более сложной литературы и участие в дискуссиях.`,
  },
  math_lit: {
    low: `Выявлены пробелы в применении математических знаний для решения практических задач. Сложности с интерпретацией условий, выбором метода и вычислениями. Нужна интенсивная работа над базовыми концепциями и их практическим применением.`,
    mid: `С основными задачами ученик справляется, но испытывает трудности с нестандартными или многоэтапными заданиями. Стоит уделить внимание развитию логического мышления и отработке типовых задач ЕНТ.`,
    high: `Демонстрирует уверенное владение математическими навыками для практико-ориентированных задач. Логика и аппарат применяются корректно. Для углубления — решать задачи повышенной сложности и олимпиадные наборы.`,
  },
  history: {
    low: `Знания по ключевым периодам и событиям фрагментарны. Сложно устанавливать причинно-следственные связи и анализировать источники. Нужна систематическая работа, начиная с базовых тем.`,
    mid: `Есть базовые знания, но встречаются ошибки в датах, персоналиях и деталях. Аналитические навыки требуют развития. Рекомендуется углублённое изучение сложных тем, работа с картами и документами.`,
    high: `Глубокие и систематизированные знания: хорошая хронология, понимание процессов и умение анализировать. Для роста — специализированная литература и расширение источников.`,
  },
  profile: {
    low: (name) =>
      `По предмету «${name}» у ученика выявлены серьёзные пробелы в базовых понятиях и формулах. Применение теории на практике вызывает трудности. Нужна фундаментальная проработка базового материала и регулярная практика.`,
    mid: (name) =>
      `Ученик понимает основные разделы предмета «${name}», но не всегда уверенно решает задачи средней/высокой сложности. Нужны систематизация и отработка практических навыков.`,
    high: (name) =>
      `Высокий уровень по предмету «${name}»: теория усвоена, навыки решения задач развиты. Можно сосредоточиться на сложных темах и олимпиадных заданиях.`,
  },
};

export default function GeneralSummary() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `${BASE_URL}/api/v1/student_result/result/${id}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchResult();
  }, [id]);

  const vm = useMemo(() => {
    if (!data) return null;

    const readingScore = data.reading_literacy_score ?? 0;
    const mathLitScore = data.math_literacy_score ?? 0;
    const historyScore = data.history_score ?? 0;

    const prof1Name = data.profile_subject_1_name || "Профильный предмет 1";
    const prof2Name = data.profile_subject_2_name || "Профильный предмет 2";
    const prof1Score = data.profile_subject_1_score ?? 0;
    const prof2Score = data.profile_subject_2_score ?? 0;

    const readingPct = pct(readingScore, MAX.reading);
    const mathLitPct = pct(mathLitScore, MAX.math_lit);
    const historyPct = pct(historyScore, MAX.history);
    const prof1Pct = pct(prof1Score, MAX.profile);
    const prof2Pct = pct(prof2Score, MAX.profile);

    return {
      studentName: data.student_name || "—",
      direction: data.direction || "—",
      reading: {
        score: readingScore,
        pct: readingPct,
        level: levelByPct(readingPct),
      },
      mathLit: {
        score: mathLitScore,
        pct: mathLitPct,
        level: levelByPct(mathLitPct),
      },
      history: {
        score: historyScore,
        pct: historyPct,
        level: levelByPct(historyPct),
      },
      prof1: {
        name: prof1Name,
        score: prof1Score,
        pct: prof1Pct,
        level: levelByPct(prof1Pct),
      },
      prof2: {
        name: prof2Name,
        score: prof2Score,
        pct: prof2Pct,
        level: levelByPct(prof2Pct),
      },
    };
  }, [data]);

  if (loading) {
    return (
      <section className={`${s.wrapper} container`}>
        <div className={s.card}>
          <div className={s.loading}>Загрузка…</div>
        </div>
      </section>
    );
  }

  if (error || !vm) {
    return (
      <section className={`${s.wrapper} container`}>
        <div className={s.card}>
          <div className={s.error}>Ошибка: {error || "Нет данных"}</div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${s.wrapper} container`}>
      <div className={s.card}>
        {/* HERO */}
        <div className={s.hero}>
          <div className={s.heroLeft}>
            <img className={s.logo} src="/assets/icons/logo.png" alt="Jiyrma" />
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

        <div className={s.body}>
          <h3 className={s.sectionTitle}>Общая характеристика</h3>

          {/* Грамотность чтения */}
          <div className={s.whiteBox}>
            <div className={s.whiteBoxTitle}>
              Грамотность чтения — {vm.reading.score}/{MAX.reading} (
              {vm.reading.pct}%)
              <span className={`${s.level} ${s[vm.reading.level]}`}>
                {" "}
                · {levelTitle[vm.reading.level]}
              </span>
            </div>
            <p className={s.whiteBoxText}>{TEXTS.reading[vm.reading.level]}</p>
          </div>

          {/*  Математическая грамотность */}
          <div className={s.whiteBox}>
            <div className={s.whiteBoxTitle}>
              Математическая грамотность — {vm.mathLit.score}/{MAX.math_lit} (
              {vm.mathLit.pct}%)
              <span className={`${s.level} ${s[vm.mathLit.level]}`}>
                {" "}
                · {levelTitle[vm.mathLit.level]}
              </span>
            </div>
            <p className={s.whiteBoxText}>{TEXTS.math_lit[vm.mathLit.level]}</p>
          </div>

          {/*  История Казахстана */}
          <div className={s.whiteBox}>
            <div className={s.whiteBoxTitle}>
              История Казахстана — {vm.history.score}/{MAX.history} (
              {vm.history.pct}%)
              <span className={`${s.level} ${s[vm.history.level]}`}>
                {" "}
                · {levelTitle[vm.history.level]}
              </span>
            </div>
            <p className={s.whiteBoxText}>{TEXTS.history[vm.history.level]}</p>
          </div>

          {/* Профильный предмет 1 */}
          <div className={s.whiteBox}>
            <div className={s.whiteBoxTitle}>
              {vm.prof1.name} — {vm.prof1.score}/{MAX.profile} ({vm.prof1.pct}%)
              <span className={`${s.level} ${s[vm.prof1.level]}`}>
                {" "}
                · {levelTitle[vm.prof1.level]}
              </span>
            </div>
            <p className={s.whiteBoxText}>
              {TEXTS.profile[vm.prof1.level](vm.prof1.name)}
            </p>
          </div>

          {/* Профильный предмет 2 */}
          <div className={s.whiteBox}>
            <div className={s.whiteBoxTitle}>
              {vm.prof2.name} — {vm.prof2.score}/{MAX.profile} ({vm.prof2.pct}%)
              <span className={`${s.level} ${s[vm.prof2.level]}`}>
                {" "}
                · {levelTitle[vm.prof2.level]}
              </span>
            </div>
            <p className={s.whiteBoxText}>
              {TEXTS.profile[vm.prof2.level](vm.prof2.name)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
