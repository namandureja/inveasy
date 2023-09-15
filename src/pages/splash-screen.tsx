import { FileText } from "lucide-react";

export default function SplashScreen() {
  return (
    <main className="flex flex-col items-center w-full justify-center min-h-[100vh]">
      <div className="flex gap-2 items-center flex-row-reverse">
        <h1 className="text-3xl font-semibold">InvEasy</h1>
        <FileText />
      </div>
      <p className="text-xl mt-1">Invoicing made easy.</p>
    </main>
  );
}
