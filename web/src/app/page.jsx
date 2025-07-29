import AuthForm from "@/components/AuthForm/AuthForm";
import TestFrom from "@/components/TestFrom/TestFrom";
import ThankYouScreen from "@/components/ThankYouScreen/ThankYouScreen";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container">
      <AuthForm />
      {/* <TestFrom /> */}
      {/* <ThankYouScreen /> */}
    </main>
  );
}
