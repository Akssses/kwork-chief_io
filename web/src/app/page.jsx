"use client";

import { useState } from "react";
import AuthForm from "@/components/AuthForm/AuthForm";
import TestFrom from "@/components/TestFrom/TestFrom";
import ThankYouScreen from "@/components/ThankYouScreen/ThankYouScreen";

export default function Home() {
  const [step, setStep] = useState("auth");
  const [ctx, setCtx] = useState({
    subjectSetId: null,
    lang: "ru",
    user: { name: "", phone: "", email: "" },
  });

  return (
    <main className="container">
      {step === "auth" && (
        <AuthForm
          onStart={({ name, phone, email, directionId, testLanguage }) => {
            if (!directionId) return;
            setCtx({
              subjectSetId: directionId,
              lang: testLanguage,
              user: { name, phone, email },
            });
            setStep("test");
          }}
        />
      )}

      {step === "test" && (
        <TestFrom
          subjectSetId={ctx.subjectSetId}
          lang={ctx.lang}
          onFinish={() => setStep("thanks")}
        />
      )}

      {step === "thanks" && <ThankYouScreen />}
    </main>
  );
}
