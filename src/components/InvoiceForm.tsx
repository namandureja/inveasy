import React, { FC, useState } from "react";
import InvoiceModal from "./InvoiceModal";
import { Invoice } from "@/data/types";

import { Button } from "./ui/button";
import { initialInvoice } from "@/data/initialData";
import InvoiceView from "./InvoiceView";

interface Props {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  pdfMode?: boolean;
  onChange?: (invoice: Invoice) => void;
}

const InvoiceForm: FC<Props> = ({ invoice, setInvoice, pdfMode, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const reviewInvoiceHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  return (
    <div className="relative flex flex-col px-2 md:flex-row gap-2 w-full">
      <form
        className="relative my-6 flex-1 p-1 rounded-md bg-white shadow-sm"
        id="invoice-form"
        onSubmit={reviewInvoiceHandler}
      >
        <InvoiceView
          invoice={invoice}
          setInvoice={setInvoice}
          pdfMode={pdfMode}
        />
      </form>
      <div className="basis-1/4 bg-transparent">
        <div className="sticky top-0 z-10 space-y-4 divide-y divide-gray-900/10 pb-8 px-4 md:px-0 md:pt-6 md:pl-4">
          <div className="space-y-4 pb-2">
            <div className="space-y-2">
              <label className="text-sm font-bold md:text-base" htmlFor="tax">
                Tax rate:
              </label>
              <div className="flex items-center">
                <input
                  className="w-full rounded-r-none bg-white shadow-sm p-2"
                  type="number"
                  name="tax"
                  id="tax"
                  min="0.01"
                  step="0.01"
                  placeholder="0.0"
                  value={invoice.tax}
                  onChange={(event) => {
                    const value = event.target.value;
                    setInvoice((prevInvoice) => ({
                      ...prevInvoice,
                      tax: value,
                    }));
                  }}
                />
                <span className="rounded-r-md bg-gray-200 py-2 px-4 text-gray-500 shadow-sm">
                  %
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-bold md:text-base"
                htmlFor="discount"
              >
                Discount rate:
              </label>
              <div className="flex items-center">
                <input
                  className="w-full rounded-r-none bg-white shadow-sm p-2"
                  type="number"
                  name="discount"
                  id="discount"
                  min="0"
                  step="0.01"
                  placeholder="0.0"
                  value={invoice.discount}
                  onChange={(event) => {
                    const value = event.target.value;
                    setInvoice((prevInvoice) => ({
                      ...prevInvoice,
                      discount: value,
                    }));
                  }}
                />
                <span className="rounded-r-md bg-gray-200 py-2 px-4 text-gray-500 shadow-sm">
                  %
                </span>
              </div>
            </div>
          </div>
          <Button className="w-full" type="submit" form="invoice-form">
            Review Invoice
          </Button>
          <InvoiceModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            invoice={invoice}
            setInvoice={setInvoice}
            // onUpload={uploadInvoice}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
