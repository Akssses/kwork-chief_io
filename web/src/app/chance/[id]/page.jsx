"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

const API_BASE = "https://enttest.site";

export default function ChancesPage() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        // 1) Результат по id
        const res1 = await fetch(
          `${API_BASE}/api/v1/student_result/result/${id}`,
          {
            headers: { Accept: "application/json" },
          }
        );
        if (!res1.ok) throw new Error(`result HTTP ${res1.status}`);
        const result = await res1.json();

        const subjectSetId = result?.subject_set?.id;
        const score = typeof result?.score === "number" ? result.score : 0;
        if (!subjectSetId || score == null) return;

        // 2) Шансы по subject_set_id + score
        const url = `${API_BASE}/api/v1/profession/admission_chance/?subject_set_id=${subjectSetId}&score=${score}`;
        const res2 = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        if (!res2.ok) throw new Error(`chance HTTP ${res2.status}`);
        const list = await res2.json();

        // 3) Приводим к rows
        const mapped = Array.isArray(list)
          ? list.map((item) => ({
              left: item?.chance_without_preparation?.percent ?? 0,
              name: item?.profession ?? "",
              right: item?.chance_with_preparation?.percent ?? 0,
            }))
          : [];

        setRows(mapped);
      } catch {
        // не рендерим ошибок — верстку не трогаем
        setRows([]);
      }
    };

    load();
  }, [id]);

  return (
    <section className={s.wrapper}>
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
            Возможность поступить в выбранные специальныести
          </h3>

          <div className={s.colsHead}>
            <span>Без подготовки</span>
            <span>С подготовкой</span>
          </div>

          <div className={s.rows}>
            {rows.map((r, i) => (
              <div className={s.row} key={i}>
                <div className={s.leftBar} style={{ ["--w"]: `${r.left}%` }}>
                  <div className={s.leftFill} />
                  <span className={s.leftVal}>{r.left}%</span>
                </div>

                <div className={s.major}>{r.name}</div>

                <div className={s.rightBar} style={{ ["--w"]: `${r.right}%` }}>
                  <div className={s.fill} />
                  <span className={s.rightVal}>{r.right}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className={s.note}>
            <div className={s.noteTitle}>Примечание:</div>
            <p>
              Не все дети могут поступить в лучшие ВУЗы страны, кому-то это
              вовсе не нужно, подготовка бывает сложной и не дает результата. По
              статистике 10,8% детей поступают без специализированной подготовки
              в лучшие ВУЗы страны, и 89,2% поступают с помощью специальной
              подготовки и правильного подхода, что включает в себя мотивацию,
              целеполагание, подготовку, наставничество и поддержку родителей,
              практику решения задач.
            </p>
          </div>

          <div className={s.infoBox}>
            <div className={s.infoLeft}>
              <div className={s.number}>10</div>
              <div className={s.caption}>месяцев у вас</div>
            </div>
            <div className={s.infoText}>
              На подготовку к поступлению в ВУЗы. При подготовке к экзаменам ЕНТ
              улучшается общий уровень успеваемости по основным и профильным
              предметам и так, как у ребенка и родителей появляется цель,
              результат будет быстрый и качественный.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
