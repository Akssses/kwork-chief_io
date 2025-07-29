"use client";

import Link from "next/link";
import s from "./ThankYouScreen.module.scss";

export default function ThankYouScreen() {
  return (
    <div className={s.card}>
      <img
        src="/assets/icons/logo.svg"
        className={s.logo}
        alt="Tesla Education"
      />

      <div className={s.content}>
        <div className={s.textBlock}>
          <h1>
            Благодарим
            <br />
            за честность!
          </h1>
          <Link href={"/"}>
            <button className={s.button}>Назад на главную</button>
          </Link>
        </div>

        <div className={s.character}>
          <img src="/assets/images/teacher3.png" alt="Teacher" />
        </div>
      </div>
    </div>
  );
}
