"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import s from "./page.module.scss";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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
      direction = "",
      math_literacy_score = 0,
      history_score = 0,
      reading_literacy_score = 0,
      profile_subject_1_name = "",
      profile_subject_1_score = 0,
      profile_subject_2_name = "",
      profile_subject_2_score = 0,
      score,
    } = data;

    const total =
      typeof score === "number"
        ? score
        : (math_literacy_score || 0) +
          (history_score || 0) +
          (reading_literacy_score || 0) +
          (profile_subject_1_score || 0) +
          (profile_subject_2_score || 0);

    const percent = Math.max(
      0,
      Math.min(100, Math.round((total / MAX.total) * 100))
    );

    return {
      student_name,
      direction,
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
    if (!cardRef.current) return;

    const node = cardRef.current;

    const canvas = await html2canvas(node, {
      scale: 2, // четче
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgHeight; // сдвиг
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
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
              <strong className={s.infoValue}>{vm.direction || "—"}</strong>
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

      {/* Кнопка скачивания PDF */}
      <button className={s.pdf_button} onClick={handleDownloadPdf}>
        Скачать PDF
      </button>
    </section>
  );
}
