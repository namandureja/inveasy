import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InvoiceServer } from "@/data/types";
import useLongPress from "@/hooks/onLongPress";
import { cn } from "@/lib/utils";
import { useBarStore } from "@/state/bar-state";
import { FileText } from "lucide-react";
import { useState } from "react";

export default function FileCard({ invoice }: { invoice?: InvoiceServer }) {
  const [selected, setSelected] = useState(false);
  const { addSelected } = useBarStore();
  const onLongPress = () => {
    setSelected(true);
    addSelected("");
  };

  const onClick = () => {
    // setSelected(!selected);
    if (selected) {
      setSelected(false);
    }
  };

  const longPressEvent = useLongPress({
    onLongPress,
    onClick,
  });

  return (
    <Card
      key={invoice?.id}
      {...longPressEvent}
      className={cn(
        "cursor-pointer shadow-sm transition-all ease duration-200 hover:bg-gray-100 hover:bg-opacity-60 select-none",
        selected ? "bg-blue-100 bg-opacity-40 hover:bg-blue-100" : ""
      )}
    >
      <CardHeader className="flex items-center justify-center border-b">
        <FileText size={40} className="opacity-60 my-2" />
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="text-base mt-2 font-semibold">{invoice?.invoiceTitle || "#123"}</p>
        <small className="text-sm">{invoice?.createdAt || "2 Hours ago"}</small>
      </CardContent>
    </Card>
  );
}
