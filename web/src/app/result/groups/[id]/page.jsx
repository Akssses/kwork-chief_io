"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://enttest.site";

// Максимальные баллы
const MAX = {
  reading: 20, // Грамотность чтения
  math_lit: 15, // Математическая грамотность
  history: 15, // История Казахстана
  profile: 45, // каждый профильный
};
const GENERAL_MAX = MAX.reading + MAX.math_lit + MAX.history; // 50
const PROFILE_MAX = MAX.profile * 2; // 90

const pct = (score, max) =>
  Math.max(0, Math.min(100, Math.round(((score || 0) / max) * 100)));
const levelByPct = (p) => (p < 50 ? "low" : p <= 70 ? "mid" : "high");
const levelTitle = {
  low: "Низкий результат",
  mid: "Средний результат",
  high: "Высокий результат",
};

// Тексты по группам
const GROUP_TEXT = {
  general: {
    low: `Результаты по блоку общих предметов указывают на наличие существенных трудностей в освоении базовых академических навыков и знаний. Это может повлиять на общую готовность к ЕНТ. Требуется комплексная работа по всем трём направлениям.`,
    mid: `По блоку общих предметов ученик демонстрирует удовлетворительный уровень. База есть, но для более высоких результатов нужно подтянуть слабые места в каждом из трёх предметов и углубить понимание материала.`,
    high: `Высокий уровень по блоку общих предметов. Навыки чтения/анализа информации, математическая грамотность и знания по истории на хорошем уровне — прочная основа для успешной сдачи ЕНТ.`,
  },
  profile: {
    low: (n1, n2) =>
      `Результаты по профильным предметам (${n1} и ${n2}) указывают на серьёзные затруднения. Нужен индивидуальный план занятий и интенсивная проработка ключевых тем по каждой дисциплине.`,
    mid: (n1, n2) =>
      `По профильным предметам (${n1} и ${n2}) — средний уровень. Понимание основ есть, но для сильного результата на ЕНТ требуется углубление тем, отработка сложных задач и систематизация знаний.`,
    high: (n1, n2) =>
      `По профильным предметам (${n1} и ${n2}) — уверенный высокий уровень. Это отличный показатель готовности к ЕНТ. Сохраняйте темп и периодически повторяйте сложные темы.`,
  },
};

export default function GroupsSummaryPage() {
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

    const reading = data.reading_literacy_score ?? 0;
    const mathLit = data.math_literacy_score ?? 0;
    const history = data.history_score ?? 0;

    const prof1Name = data.profile_subject_1_name || "Профильный предмет 1";
    const prof2Name = data.profile_subject_2_name || "Профильный предмет 2";
    const prof1 = data.profile_subject_1_score ?? 0;
    const prof2 = data.profile_subject_2_score ?? 0;

    const generalSum = reading + mathLit + history;
    const profileSum = prof1 + prof2;

    const generalPct = pct(generalSum, GENERAL_MAX);
    const profilePct = pct(profileSum, PROFILE_MAX);

    return {
      studentName: data.student_name || "—",
      direction: data.direction || "—",

      reading,
      mathLit,
      history,
      prof1Name,
      prof2Name,
      prof1,
      prof2,

      general: {
        sum: generalSum,
        max: GENERAL_MAX,
        pct: generalPct,
        level: levelByPct(generalPct),
      },
      profile: {
        sum: profileSum,
        max: PROFILE_MAX,
        pct: profilePct,
        level: levelByPct(profilePct),
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
        <div className={s.hero}>
          <div className={s.heroLeft}>
            <img
              className={s.logo}
              src="/assets/icons/logo.svg"
              alt="Tesla Education"
            />
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
          <h3 className={s.sectionTitle}>Оценка по группам предметов</h3>

          <div className={s.whiteBoxes}>
            {/*  Общие предметы */}
            <div className={s.whiteBox}>
              <div className={s.whiteBoxTitle}>
                Общие предметы (грамотность чтения, математическая грамотность,
                история Казахстана)
              </div>

              <p className={s.whiteBoxText}>
                {GROUP_TEXT.general[vm.general.level]}
              </p>
            </div>

            {/*  Профильные предметы */}
            <div className={s.whiteBox}>
              <div className={s.whiteBoxTitle}>
                Профильные предметы ({vm.prof1Name} и {vm.prof2Name})
              </div>

              <p className={s.whiteBoxText}>
                {GROUP_TEXT.profile[vm.profile.level](
                  vm.prof1Name,
                  vm.prof2Name
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
