"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import s from "./page.module.scss";
import GeneralSummary from "@/app/result/characteristic/[id]/page";
import ConclusionPage from "@/app/result/conclusion/[id]/page";
import GroupsSummaryPage from "@/app/result/groups/[id]/page";
import ChancesPage from "@/app/chance/page";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://enttest.site";

const MAX = {
  math_lit: 15,
  history: 15,
  reading: 20,
  profile: 45,
  total: 140,
};

export default function ResultPage() {
  const { id } = useParams();
  const cardRef = useRef(null);
  const generalRef = useRef(null);
  const conclusionRef = useRef(null);
  const groupsRef = useRef(null);
  const chancesRef = useRef(null);

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

    const {
      student_name = "",
      // если у тебя ещё где-то используется direction — оставим
      direction = "",
      subject_set, // может быть объект {id,title,...} или число (id)
      math_literacy_score = 0,
      history_score = 0,
      reading_literacy_score = 0,
      profile_subject_1_name = "",
      profile_subject_1_score = 0,
      profile_subject_2_name = "",
      profile_subject_2_score = 0,
      score,
      score_percentage, // бывает в ответе
    } = data;

    // унифицируем subject_set
    const subjectSetId =
      typeof subject_set === "number" ? subject_set : subject_set?.id ?? null;
    const subjectSetTitle =
      typeof subject_set === "object" && subject_set?.title
        ? subject_set.title
        : direction || ""; // на всякий пожарный — падать не будем

    const total =
      typeof score === "number"
        ? score
        : (math_literacy_score || 0) +
          (history_score || 0) +
          (reading_literacy_score || 0) +
          (profile_subject_1_score || 0) +
          (profile_subject_2_score || 0);

    const percent =
      typeof score_percentage === "number"
        ? Math.max(0, Math.min(100, Math.round(score_percentage)))
        : Math.max(0, Math.min(100, Math.round((total / MAX.total) * 100)));

    return {
      student_name,
      subject_set: subject_set ?? null, // вернём как есть (объект/число/null)
      subjectSetId,
      subjectSetTitle,
      math_literacy_score,
      history_score,
      reading_literacy_score,
      profile_subject_1_name,
      profile_subject_1_score,
      profile_subject_2_name,
      profile_subject_2_score,
      total,
      percent,
    };
  }, [data]);

  const handleDownloadPdf = async () => {
    const refs = [cardRef, generalRef, conclusionRef, groupsRef, chancesRef];
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      if (!ref.current) continue;
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 0;
      let heightLeft = imgHeight;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }
    pdf.save(
      `ENT-result-${(vm?.student_name || "student").replace(/\s+/g, "_")}.pdf`
    );
  };

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
      <div className={s.card} ref={cardRef}>
        {/* HERO */}
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

        {/* CONTENT */}
        <div className={s.body}>
          <p className={s.path}>
            Диагностика успеваемости ученика по тесту ЕНТ
          </p>

          <h2 className={s.hello}>
            <span>Салем!</span> {vm.student_name || "—"}
          </h2>

          <div className={s.infoRow}>
            <div className={s.infoBox}>
              <span className={s.infoLabel}>Направление:</span>
              <strong className={s.infoValue}>
                {vm.subjectSetTitle || "—"}
              </strong>
            </div>
            <div className={s.infoBox}>
              <span className={s.infoLabel}>Цель:</span>
              <strong className={s.infoValue}>Диагностика знаний</strong>
            </div>
            <div className={s.resultBox}>
              <span className={s.resultLabel}>Результаты тестирования</span>
              <div className={s.resultValue}>{vm.percent.toFixed(0)}%</div>
            </div>
          </div>

          <div className={s.section}>
            <h3>Диагностика</h3>
            <p className={s.description}>
              Представленная диагностика рассматривает академические способности
              ребенка на основе результатов пробного ЕНТ. Оценка проведена по
              шкале, где указано количество набранных баллов по сравнению с
              максимальной возможной. Этот подход позволяет выявить как сильные,
              так и слабые стороны в уровне подготовки к ЕНТ, что является
              ключом к разработке индивидуального плана обучения.
            </p>
          </div>

          <div className={s.scoreCard}>
            <div className={s.scoreHeader}>Основные предметы</div>

            <div className={s.mainGrid}>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>
                  Математическая
                  <br />
                  грамотность
                </div>
                <div className={s.smallScore}>
                  {vm.math_literacy_score}/{MAX.math_lit}
                </div>
              </div>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>
                  История
                  <br />
                  Казахстана
                </div>
                <div className={s.smallScore}>
                  {vm.history_score}/{MAX.history}
                </div>
              </div>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>Грамотность чтения</div>
                <div className={s.smallScore}>
                  {vm.reading_literacy_score}/{MAX.reading}
                </div>
              </div>

              <div className={s.bigScoreBox}>
                <div className={s.bigScoreValue}>
                  {vm.total}/{MAX.total}
                </div>
                <div className={s.bigScoreLabel}>баллов</div>
              </div>
            </div>

            <div className={s.profileHeader}>Профильные предметы</div>

            <div className={s.profileGrid}>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>
                  {vm.profile_subject_1_name || "Профильный 1"}
                </div>
                <div className={s.smallScore}>
                  {vm.profile_subject_1_score}/{MAX.profile}
                </div>
              </div>
              <div className={s.smallBox}>
                <div className={s.smallTitle}>
                  {vm.profile_subject_2_name || "Профильный 2"}
                </div>
                <div className={s.smallScore}>
                  {vm.profile_subject_2_score}/{MAX.profile}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "800px",
        }}
      >
        <div ref={generalRef}>
          <GeneralSummary id={id} />
        </div>
        <div ref={conclusionRef}>
          <ConclusionPage id={id} />
        </div>
        <div ref={groupsRef}>
          <GroupsSummaryPage id={id} />
        </div>
        <div ref={chancesRef}>
          <ChancesPage id={id} />
        </div>
      </div>

      {/* Кнопка скачивания PDF */}
      <button className={s.pdf_button} onClick={handleDownloadPdf}>
        Скачать PDF
      </button>
    </section>
  );
}
