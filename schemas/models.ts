import { z } from "zod";

export const UnitSchema = z.object({
  id: z.string().min(1),
  tipologia: z.string().min(1),
  m2: z.number().positive(),
  price: z.number().int().positive(),
  estacionamiento: z.boolean(),
  bodega: z.boolean(),
  disponible: z.boolean(),
});

export const BuildingSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  comuna: z.string().min(1),
  address: z.string().min(1),
  amenities: z.array(z.string().min(1)).min(1),
  gallery: z.array(z.string().min(1)).min(3),
  units: z.array(UnitSchema).min(1),
});

export const BookingRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  buildingId: z.string().min(1),
  unitId: z.string().min(1),
  message: z.string().optional(),
  preferredDate: z.string().datetime().optional(),
});

export type Unit = z.infer<typeof UnitSchema>;
export type Building = z.infer<typeof BuildingSchema>;
export type BookingRequest = z.infer<typeof BookingRequestSchema>;


