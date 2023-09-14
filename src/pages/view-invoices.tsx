import InvoiceForm from "@/components/InvoiceForm";
import InvoiceView from "@/components/InvoiceView";
import { Button } from "@/components/ui/button";
import { initialInvoice } from "@/data/initialData";
import { Invoice } from "@/data/types";
import { useInvoiceQuery } from "@/hooks/queries/useInvoicesQuery";
import { FileText, Mail, Printer, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import SplashScreen from "./splash-screen";

function ViewInvoicePage() {
  const { id } = useParams();
  const { data: invoiceData } = useInvoiceQuery(id!);
  const [invoice, setInvoice] = useState<Invoice>({ ...initialInvoice });

  useEffect(() => {
    if (invoiceData) {
      setInvoice(invoiceData);
    }
  }, [invoiceData]);

  if (!invoiceData) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex gap-1 items-center flex-row-reverse w-full justify-center py-6">
        <h1 className="text-2xl font-semibold">InvEasy</h1>
        <FileText />
      </div>
      <div className="flex items-center gap-3 justify-center flex-wrap pb-3 px-4">
        <Button
          onClick={() => {
            const doc = new jsPDF({
              compress: true,
            });
            const divToPrint = document.querySelector("#print-this");
            if (!divToPrint) return;
            doc.html(divToPrint as HTMLElement, {
              width: 200,
              windowWidth: 700,
              x: 5,
              callback: function (pdf) {
                pdf.save("invoice.pdf");
              },
            });
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText size={18} />
          <span>Download as PDF</span>
        </Button>
        <Button
          onClick={() => {
            window.print();
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Printer size={18} />
          <span>Print</span>
        </Button>
        <Button
          onClick={() => {}}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Table size={18} />
          <span>Download as CSV</span>
        </Button>
        <Button
          onClick={() => {}}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Mail size={18} />
          <span>Send as Email</span>
        </Button>
      </div>
      <div className="mx-auto max-w-5xl mt-3 pb-5 px-3" id="print-this">
        <InvoiceView pdfMode={true} invoice={invoice} setInvoice={setInvoice} />
      </div>
    </div>
  );
}

export default ViewInvoicePage;
