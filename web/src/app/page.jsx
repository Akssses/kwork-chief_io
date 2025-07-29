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
    directionTitle: "",
    user: { name: "", phone: "", parentName: "" },
  });

  return (
    <main className="container">
      {step === "auth" && (
        <AuthForm
          onStart={({
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
          }}
        />
      )}

      {step === "test" && (
        <TestFrom
          subjectSetId={ctx.subjectSetId}
          lang={ctx.lang}
          directionTitle={ctx.directionTitle}
          user={ctx.user}
          onFinish={() => setStep("thanks")}
        />
      )}

      {step === "thanks" && <ThankYouScreen />}
    </main>
  );
}
