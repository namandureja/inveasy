import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { signOut } from "@/firebase/auth";
import { FileText, LayoutGrid, LayoutList, LogOut, Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  return (
    <main className="relative h-[100svh] flex flex-col">
      <header className="flex items-center justify-end px-6 pt-5 pb-1 text-2xl">
        {/* <div className="flex items-center gap-1 flex-row-reverse">
          <h1 className="font-semibold">InvEasy</h1>
          <FileText />
        </div> */}
        <button onClick={signOut}>
          <LogOut size={24} />
        </button>
      </header>
      <div className="px-6 flex-1 overflow-hidden flex flex-col">
        <p className="text-2xl">Hello,</p>
        <h1 className="text-4xl font-black">Naman.</h1>
        <div className="mt-4 text-lg font-bold w-full border-b pb-2 flex justify-between items-center">
          Your Invoices
          {layout === "grid" ? (
            <LayoutGrid
              size={22}
              className="opacity-70"
              onClick={() => setLayout("list")}
            />
          ) : (
            <LayoutList
              size={22}
              className="opacity-70"
              onClick={() => setLayout("grid")}
            />
          )}
        </div>
        <div className="grid grid-cols-2 pt-4 gap-5 overflow-scroll pb-4">
          <Card>
            <CardHeader className="flex items-center justify-center border-b">
              <FileText size={40} className="opacity-60 my-2" />
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-base mt-2 font-semibold">#Invoice 1</p>
              <small className="text-sm">2 Hours ago</small>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-center border-b">
              <FileText size={40} className="opacity-60 my-2" />
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-base mt-2 font-semibold">#Invoice 1</p>
              <small className="text-sm">2 Hours ago</small>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-center border-b">
              <FileText size={40} className="opacity-60 my-2" />
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-base mt-2 font-semibold">#Invoice 1</p>
              <small className="text-sm">2 Hours ago</small>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-center border-b">
              <FileText size={40} className="opacity-60 my-2" />
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-base mt-2 font-semibold">#Invoice 1</p>
              <small className="text-sm">2 Hours ago</small>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-center border-b">
              <FileText size={40} className="opacity-60 my-2" />
            </CardHeader>
            <CardContent className="px-4 pb-2">
              <p className="text-base mt-2 font-semibold">#Invoice 1</p>
              <small className="text-sm">2 Hours ago</small>
            </CardContent>
          </Card>
        </div>
        <div className="absolute bg-primary bottom-6 text-white right-4 text-3xl p-3 rounded-full">
          <Plus size={32} />
        </div>
      </div>
    </main>
  );
}
