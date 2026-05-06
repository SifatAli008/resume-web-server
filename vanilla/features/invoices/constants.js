export const INVOICE_TEMPLATE_IDS = {
  FLUVO_1: "invoice_fluvo_1",
  FLUVO_2: "invoice_fluvo_2",
  FLUVO_3: "invoice_fluvo_3",
  FLUVO_4: "invoice_fluvo_4",
  FLUVO_5: "invoice_fluvo_5",
  FLUVO_6: "invoice_fluvo_6",
  FLUVO_7: "invoice_fluvo_7",
  FLUVO_8: "invoice_fluvo_8",
  FLUVO_9: "invoice_fluvo_9",
  FLUVO_10: "invoice_fluvo_10",
  FLUVO_11: "invoice_fluvo_11",
  FLUVO_12: "invoice_fluvo_12",
  FLUVO_13: "invoice_fluvo_13",
  FLUVO_14: "invoice_fluvo_14",
  FLUVO_15: "invoice_fluvo_15",
  FLUVO_16: "invoice_fluvo_16",
  FLUVO_17: "invoice_fluvo_17",
  FLUVO_18: "invoice_fluvo_18",
  FLUVO_19: "invoice_fluvo_19",
  FLUVO_20: "invoice_fluvo_20",
};

export const KNOWN_INVOICE_TEMPLATE_IDS = Object.values(INVOICE_TEMPLATE_IDS);

export function isKnownInvoiceTemplateId(id) {
  return KNOWN_INVOICE_TEMPLATE_IDS.includes(id);
}
