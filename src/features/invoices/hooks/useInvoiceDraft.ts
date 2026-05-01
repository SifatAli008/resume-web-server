"use client";

import { useEffect, useState } from "react";

export type InvoiceDraft = {
  invoice_number?: string;
  invoice_title?: string;
  invoice_date?: string;
  due_date?: string;
  po_number?: string;
  payment_method?: string;
  payment_instructions?: string;
  terms?: string;
  signature?: string;
  discount?: number;
  tax_percent?: number;
  subtotal?: number;
  currency?: string;
  items?: Array<{
    description?: string;
    quantity?: number;
    rate?: number;
  }>;
  company?: {
    name?: string;
    address?: string;
    address_line2?: string;
    email?: string;
    phone?: string;
    website?: string;
    tax_id?: string;
    tax_number?: string;
    license_number?: string;
  };
  client?: {
    name?: string;
    address?: string;
    address_line2?: string;
    email?: string;
    phone?: string;
    website?: string;
    tax_id?: string;
    details?: string;
  };
};

declare global {
  interface Window {
    __invoiceDraft?: InvoiceDraft;
  }
}

function readInitialDraft(): InvoiceDraft {
  if (typeof document === "undefined") return {};

  const script = document.getElementById("__invoice_draft__");
  if (!script?.textContent) return {};

  try {
    const parsed = JSON.parse(script.textContent) as InvoiceDraft;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function useInvoiceDraft(): InvoiceDraft {
  const [draft, setDraft] = useState<InvoiceDraft>(() => readInitialDraft());

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const onInvoiceData = (event: Event) => {
      const customEvent = event as CustomEvent<InvoiceDraft>;
      const next = customEvent.detail ?? {};
      queueMicrotask(() => {
        setDraft(next);
      });
    };

    window.addEventListener("invoiceData", onInvoiceData as EventListener);

    if (window.__invoiceDraft !== undefined) {
      queueMicrotask(() => {
        setDraft(window.__invoiceDraft ?? {});
      });
    } else {
      let attempts = 0;
      intervalId = setInterval(() => {
        attempts += 1;
        if (window.__invoiceDraft !== undefined) {
          const next = window.__invoiceDraft ?? {};
          queueMicrotask(() => {
            setDraft(next);
          });
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        } else if (attempts > 200) {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      }, 150);
    }

    return () => {
      window.removeEventListener("invoiceData", onInvoiceData as EventListener);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return draft;
}
