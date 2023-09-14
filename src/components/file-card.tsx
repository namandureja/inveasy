import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InvoiceServer } from "@/data/types";
import useLongPress from "@/hooks/onLongPress";
import { cn } from "@/lib/utils";
import { useBarStore } from "@/state/bar-state";
import { FileText, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function FileCard({ invoice }: { invoice?: InvoiceServer }) {
  const [selected, setSelected] = useState(false);
  const { addSelected } = useBarStore();
  const onLongPress = () => {
    setSelected(true);
    addSelected("");
  };

  const onClick = () => {
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
      <CardContent className="px-3 pb-2 flex justify-between items-center">
        <div>
          <p className="text-base mt-2 font-semibold">
            {invoice?.invoiceNumber || "#123"}
          </p>
          <small className="text-sm">
            {getTimeSinceCreated(
              invoice?.createdAt || new Date().toUTCString()
            )}
          </small>
        </div>
        <MoreVertical size={18} className="text-gray-500" />
      </CardContent>
    </Card>
  );
}

export function EmptyFileCard() {
  return (
    <Card
      className={cn(
        "cursor-pointer shadow-sm transition-all ease duration-200 hover:bg-gray-100 hover:bg-opacity-60 select-none"
      )}
    >
      <CardContent className="px-4 py-5">
        No invoices yet. Click the button below to create one.
      </CardContent>
    </Card>
  );
}
function getTimeSinceCreated(updatedAt: string) {
  const updated = new Date(updatedAt);
  const now = new Date();
  const timeDiff = now.getTime() - updated.getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  }
}
