import InvoiceForm from "@/components/InvoiceForm";
import InvoiceView from "@/components/InvoiceView";
import { Button } from "@/components/ui/button";
import { initialInvoice } from "@/data/initialData";
import { Invoice } from "@/data/types";
import { useInvoiceQuery } from "@/hooks/queries/useInvoicesQuery";
import { ChevronLeft, FileText, Mail, Printer, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import SplashScreen from "./splash-screen";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { EmailComposer } from "capacitor-email-composer";
import { Toast } from "@capacitor/toast";

function ViewInvoicePage() {
  const { id } = useParams();
  const { data: invoiceData } = useInvoiceQuery(id!);
  const [invoice, setInvoice] = useState<Invoice>({ ...initialInvoice });
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
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

    const csvString = csvLines.join("\n");
    const base64 = btoa(csvString);
    return base64;
  };

  const handleDownloadCSV = async (invoice: Invoice) => {
    await Toast.show({
      text: "Downloading CSV...",
      duration: "long",
      position: "bottom",
    });
    const base64 = saveCsv(invoice);
    const fileName = `invoice-${invoice.invoiceNumber}.csv`;
    const filePath = `${fileName}`;
    await Filesystem.requestPermissions();
    Filesystem.writeFile({
      data: base64,
      path: filePath,
      directory: Directory.Documents,
    })
      .then(async () => {
        console.log("File written to disk");
        setLoadingCSV(false);
        await Toast.show({
          text: "Downloaded CSV",
          duration: "long",
          position: "bottom",
        });
      })
      .catch((err) => {
        console.log(err);
        setLoadingCSV(false);
      });
  };

  if (!invoiceData) return <SplashScreen />;

  const getPDFBase64 = async () => {
    return new Promise<string>((resolve, reject) => {
      const divToPrint = document.querySelector("#print-this");
      if (!divToPrint) return reject("div not found");
      const doc = new jsPDF({
        compress: true,
      });
      doc.html(divToPrint as HTMLElement, {
        width: 200,
        windowWidth: 700,
        x: 5,
        callback: function (pdf) {
          const base64 = btoa(pdf.output());
          resolve(base64);
        },
      });
    });
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    setLoadingPDF(true);
    await Toast.show({
      text: "Downloading PDF...",
      duration: "long",
      position: "bottom",
    });
    const divToPrint = document.querySelector("#print-this");
    if (!divToPrint) return;

    const base64 = await getPDFBase64();
    const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
    const filePath = `${fileName}`;
    await Filesystem.requestPermissions();
    Filesystem.writeFile({
      data: base64 as string,
      path: filePath,
      directory: Directory.Documents,
    })
      .then(async () => {
        console.log("File written to disk");
        setLoadingPDF(false);
        await Toast.show({
          text: "Downloaded PDF",
          duration: "long",
          position: "bottom",
        });
      })
      .catch((err) => {
        console.log(err);
        setLoadingPDF(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center max-w-5xl mx-auto px-6">
        <a href="/">
          <p className="w-fit py-4 flex items-center gap-1 cursor-pointer">
            <ChevronLeft size={20} />
            Go Back
          </p>
        </a>
        {/* <div className="flex gap-1 items-center flex-row-reverse py-6">
          <h1 className="text-2xl font-semibold">InvEasy</h1>
          <FileText />
        </div> */}
      </div>
      <div className="flex items-center gap-2 justify-center flex-wrap pb-3 px-4">
        <Button
          onClick={() => {
            handleDownloadPDF(invoice);
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText size={18} />
          <span>Download as PDF</span>
        </Button>
        {/* <Button
          onClick={() => {
            window.print();
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Printer size={18} />
          <span>Print</span>
        </Button> */}
        <Button
          onClick={() => handleDownloadCSV(invoice)}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Table size={18} />
          <span>Download as CSV</span>
        </Button>
        <Button
          onClick={async () => {
            await Toast.show({
              text: "Generating files...",
              duration: "long",
              position: "bottom",
            });
            setLoadingEmail(true);
            const pdfBase64 = await getPDFBase64();
            const csvBase64 = saveCsv(invoice);
            EmailComposer.open({
              to: [invoice.clientEmail],
              subject: `Invoice #${invoice.invoiceNumber}`,
              body: `Hi ${invoice.clientName},\n\nPlease find the attached invoice.\n\nRegards,\n${invoice.companyName}`,
              isHtml: false,
              attachments: [
                {
                  path: csvBase64,
                  type: "base64",
                  name: `invoice-${invoice.invoiceNumber}.csv`,
                },
                {
                  path: pdfBase64,
                  type: "base64",
                  name: `invoice-${invoice.invoiceNumber}.pdf`,
                },
              ],
            });
            setLoadingEmail(false);
          }}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Mail size={18} />
          <span>Send as Email</span>
        </Button>
      </div>
      <div className="mx-auto max-w-5xl mt-1 pb-5 px-3" id="print-this">
        <InvoiceView pdfMode={true} invoice={invoice} setInvoice={setInvoice} />
      </div>
    </div>
  );
}

export default ViewInvoicePage;
