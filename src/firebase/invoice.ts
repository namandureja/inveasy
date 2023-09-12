import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Invoice } from "../data/types";
import { auth, db } from "./firebase";

export async function uploadInvoice(invoice: Invoice) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not logged in");
  }

  const document = await addDoc(collection(db, "invoices"), {
    ...invoice,
    userId: user.uid,
  });
  return document.id;
}

export async function fetchInvoice(invoiceId: string) {
  const document = await getDoc(doc(db, "invoices", invoiceId));

  if (!document.exists()) {
    throw new Error("Invoice not found");
  }

  return document.data() as Invoice;
}

export async function fetchInvoices() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  const invoicesCollectionQuery = query(
    collection(db, "invoices"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(invoicesCollectionQuery);

  const invoices: Invoice[] = [];
  snapshot.forEach((doc) => {
    invoices.push(doc.data() as Invoice);
  });

  return invoices;
}
