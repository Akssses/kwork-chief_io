"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://enttest.site";
const MAX_TOTAL = 140;

const clampPct = (n) => Math.max(0, Math.min(100, Math.round(n)));

export default function ConclusionPage() {
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
          {
            headers: { Accept: "application/json" },
          }
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

    const history = data.history_score ?? 0;
    const mathLit = data.math_literacy_score ?? 0;
    const reading = data.reading_literacy_score ?? 0;
    const prof1 = data.profile_subject_1_score ?? 0;
    const prof2 = data.profile_subject_2_score ?? 0;

    const total =
      typeof data.score === "number"
        ? data.score
        : history + mathLit + reading + prof1 + prof2;

    const percent = clampPct((total / MAX_TOTAL) * 100);

    let level = "low";
    if (percent >= 50 && percent <= 70) level = "mid";
    if (percent > 70) level = "high";

    return {
      studentName: data.student_name || "—",
      direction: data.direction || "—",
      total,
      percent,
      level, // low | mid | high
    };
  }, [data]);

  const conclusionText = useMemo(() => {
    if (!vm) return "";
    const p = vm.percent;
    if (vm.level === "low") {
      return `Результаты пробного теста свидетельствуют о том, что ребёнок столкнулся с серьёзными трудностями в освоении значительной части материала ЕНТ, как по общим, так и по профильным предметам. Текущий процент правильных ответов — ${p}% — вызывает обеспокоенность и требует немедленных комплексных мер.`;
    }
    if (vm.level === "mid") {
      return `Ребёнок имеет базовое понимание материала, но присутствуют пробелы. Процент: ${p}%. Необходима дальнейшая целенаправленная подготовка.`;
    }
    return `Ребёнок уверенно усвоил основную часть материала. Процент: ${p}%. Необходимо поддерживать темп и углублять знания.`;
  }, [vm]);

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
          <h3 className={s.sectionTitle}>
            Общее заключение по результатам теста
          </h3>

          <div className={`${s.whiteBox} ${s[vm.level]}`}>
            {/* <div className={s.whiteBoxTitle}>
              {vm.level === "low" && "При общем низком результате (<50%)"}
              {vm.level === "mid" && "При общем среднем результате (50–70%)"}
              {vm.level === "high" && "При общем высоком результате (>70%)"}
            </div> */}
            <p className={s.whiteBoxText}>{conclusionText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
