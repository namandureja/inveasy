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

  const saveCsv = (invoice: Invoice) => {
    const invoiceDate =
      invoice.invoiceDate !== "" ? new Date(invoice.invoiceDate) : new Date();

    const subtotal = invoice.productLines.reduce((prev, curr) => {
      if (curr.name.trim().length > 0)
        return prev + Number(curr.price * Math.floor(curr.qty));
      else return prev;
    }, 0);
    const taxRate = (parseFloat(invoice.tax || "0") * subtotal) / 100;
    const discountRate = (parseFloat(invoice.discount || "0") * subtotal) / 100;
    const total = subtotal - discountRate + taxRate;

    const csvLines = [
      `Invoice Number,"${invoice.invoiceNumber}"`,
      `Invoice Date,"${invoiceDate}"`,
      ``,
      `Company Name,"${invoice.companyName}"`,
      `Company Address,"${
        invoice.companyAddress +
        ", " +
        invoice.companyAddress2 +
        ", " +
        invoice.companyCountry
      }"`,
      ``,
      `Client Name,"${invoice.clientName}"`,
      `Client Email,"${invoice.clientEmail}"`,
      `Client Address,"${invoice.clientAddress}"`,
      ``,
      `Item ID,Name,Quantity,Price`,
      ...invoice.productLines.map(
        (item) => `"${item.id}","${item.name}","${item.qty}","${item.price}"`
      ),
      ``,
      `Subtotal,,,"${subtotal}"`,
      `Discount,,,"${invoice.discount}"`,
      `Tax,,,"${invoice.tax}"`,
      `Total,,,"${total}"`,
    ];

    window.open("data:text/csv;charset=utf-8," + csvLines.join("\n"));
  };

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
          onClick={() => saveCsv(invoice)}
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
