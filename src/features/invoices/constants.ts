/** Registry keys must match URL segment `[templateId]`. */
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
} as const;

export type KnownInvoiceTemplateId =
  (typeof INVOICE_TEMPLATE_IDS)[keyof typeof INVOICE_TEMPLATE_IDS];

export const KNOWN_INVOICE_TEMPLATE_IDS: KnownInvoiceTemplateId[] = [
  INVOICE_TEMPLATE_IDS.FLUVO_1,
  INVOICE_TEMPLATE_IDS.FLUVO_2,
  INVOICE_TEMPLATE_IDS.FLUVO_3,
  INVOICE_TEMPLATE_IDS.FLUVO_4,
  INVOICE_TEMPLATE_IDS.FLUVO_5,
  INVOICE_TEMPLATE_IDS.FLUVO_6,
  INVOICE_TEMPLATE_IDS.FLUVO_7,
  INVOICE_TEMPLATE_IDS.FLUVO_8,
  INVOICE_TEMPLATE_IDS.FLUVO_9,
  INVOICE_TEMPLATE_IDS.FLUVO_10,
  INVOICE_TEMPLATE_IDS.FLUVO_11,
  INVOICE_TEMPLATE_IDS.FLUVO_12,
  INVOICE_TEMPLATE_IDS.FLUVO_13,
  INVOICE_TEMPLATE_IDS.FLUVO_14,
  INVOICE_TEMPLATE_IDS.FLUVO_15,
  INVOICE_TEMPLATE_IDS.FLUVO_16,
  INVOICE_TEMPLATE_IDS.FLUVO_17,
  INVOICE_TEMPLATE_IDS.FLUVO_18,
  INVOICE_TEMPLATE_IDS.FLUVO_19,
  INVOICE_TEMPLATE_IDS.FLUVO_20,
];

export function isKnownInvoiceTemplateId(
  id: string
): id is KnownInvoiceTemplateId {
  return (KNOWN_INVOICE_TEMPLATE_IDS as readonly string[]).includes(id);
}
