import { FileText } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname.split("/auth/")[1]);
  return (
    <main className="flex flex-col items-center w-full sm:w-[350px] mx-auto justify-center min-h-[100svh] pb-20 px-10">
      <div className="flex gap-2 items-center flex-row-reverse">
        <h1 className="text-3xl font-semibold">InvEasy</h1>
        <FileText />
      </div>
      <p className="text-xl">Invoicing made easy.</p>
      <Tabs
        defaultValue={location.pathname.split("/auth/")[1] || "sign-in"}
        className="w-full mt-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="sign-in"
            onClick={() => {
              navigate("/auth/sign-in");
            }}
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              navigate("/auth/sign-up");
            }}
            value="sign-up"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="w-full">
        <Outlet />
      </div>
    </main>
  );
}
