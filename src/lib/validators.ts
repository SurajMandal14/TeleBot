import { z } from 'zod';

export const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  quantity: z.coerce.number().min(0.01, 'Quantity must be positive.'),
  unitPrice: z.coerce.number().min(0, 'Unit price cannot be negative.'),
  total: z.coerce.number().min(0),
});

export const invoiceSchema = z.object({
  vehicleNumber: z.string().min(1, 'Vehicle number is required.'),
  customerName: z.string().min(1, 'Customer name is required.'),
  carModel: z.string().min(1, 'Car model is required.'),
  items: z.array(lineItemSchema),
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>;
export type LineItemSchema = z.infer<typeof lineItemSchema>;
