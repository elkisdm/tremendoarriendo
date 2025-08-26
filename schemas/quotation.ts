import { z } from "zod";

export const QuotationInputSchema = z.object({
  unitId: z.string().min(1, "ID de unidad es requerido"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha debe estar en formato YYYY-MM-DD"),
  duration: z.number().min(1).max(24, "Duración debe estar entre 1 y 24 meses"),
  includeUtilities: z.boolean().default(false),
  includeFurniture: z.boolean().default(false),
});

export type QuotationInput = z.infer<typeof QuotationInputSchema>;

export const QuotationResponseSchema = z.object({
  success: z.boolean(),
  quotation: z.object({
    unitId: z.string(),
    startDate: z.string(),
    duration: z.number(),
    monthlyRent: z.number(),
    deposit: z.number(),
    utilities: z.number().optional(),
    furniture: z.number().optional(),
    totalFirstMonth: z.number(),
    totalContract: z.number(),
    breakdown: z.object({
      rent: z.number(),
      deposit: z.number(),
      utilities: z.number().optional(),
      furniture: z.number().optional(),
      fees: z.number(),
    }),
  }).optional(),
  error: z.string().optional(),
});

export type QuotationResponse = z.infer<typeof QuotationResponseSchema>;
