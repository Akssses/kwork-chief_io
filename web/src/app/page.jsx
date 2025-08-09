"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import AuthForm from "@/components/AuthForm/AuthForm";
import TestFrom from "@/components/TestFrom/TestFrom";
import ThankYouScreen from "@/components/ThankYouScreen/ThankYouScreen";

const LS_KEY_STATE = "quiz-state-v1"; // { step, ctx }

const initialCtx = {
  subjectSetId: null,
  lang: "ru",
  directionTitle: "",
  user: { name: "", phone: "", parentName: "" },
};

export default function Home() {
  const [step, setStep] = useState("auth");
  const [ctx, setCtx] = useState(initialCtx);
  const [ready, setReady] = useState(false);
  const loadedRef = useRef(false);

  // ── restore on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_STATE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.step) setStep(parsed.step);
        if (parsed?.ctx) setCtx(parsed.ctx);
      }
    } catch {}
    loadedRef.current = true;
    setReady(true);
  }, []);

  // ── persist on change
  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      localStorage.setItem(LS_KEY_STATE, JSON.stringify({ step, ctx }));
    } catch {}
  }, [step, ctx]);

  const handleStart = ({
    name,
    phone,
    parentName,
    directionId,
    directionTitle,
    testLanguage,
  }) => {
    setCtx({
      subjectSetId: directionId,
      lang: testLanguage,
      directionTitle,
      user: { name, phone, parentName },
    });
    setStep("test");
  };

  // Переходим на экран «Спасибо»
  const handleFinish = () => {
    setStep("thanks");
  };

  // Полный сброс ключей localStorage, связанных с квизом
  const clearQuizStorage = useCallback(() => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith("quiz-")) {
          localStorage.removeItem(key);
        }
      }
    } catch {}
  }, []);

  // Рестарт: чистим всё и возвращаемся в Auth
  const handleRestart = useCallback(() => {
    try {
      clearQuizStorage();
      localStorage.removeItem(LS_KEY_STATE);
    } catch {}
    setCtx(initialCtx);
    setStep("auth");
  }, [clearQuizStorage]);

  if (!ready) return null; // без мерцаний при гидрации

  return (
    <main className="container">
      {step === "auth" && <AuthForm onStart={handleStart} />}

      {step === "test" && (
        <TestFrom
          subjectSetId={ctx.subjectSetId}
          lang={ctx.lang}
          directionTitle={ctx.directionTitle}
          user={ctx.user}
          onFinish={handleFinish}
        />
      )}

      {step === "thanks" && <ThankYouScreen onRestart={handleRestart} />}
    </main>
  );
}
