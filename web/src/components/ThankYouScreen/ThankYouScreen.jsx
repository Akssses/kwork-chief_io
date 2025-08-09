"use client";

import { useCallback } from "react";
import s from "./ThankYouScreen.module.scss";

export default function ThankYouScreen({ onRestart }) {
  const handleBack = useCallback(() => {
    onRestart?.();
  }, [onRestart]);

  return (
    <div className={s.card}>
      <img src="/assets/icons/logo.png" className={s.logo} alt="Jiyrma" />

      <div className={s.content}>
        <div className={s.textBlock}>
          <h1>
            Благодарим
            <br />
            за честность!
          </h1>

          <button className={s.button} onClick={handleBack}>
            Назад на главную
          </button>
        </div>

        <div className={s.character}>
          <img src="/assets/images/teacher3.png" alt="Teacher" />
        </div>
      </div>
    </div>
  );
}
