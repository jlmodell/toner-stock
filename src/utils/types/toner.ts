import { z } from "zod";

export const tonerSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  isColor: z.boolean(),
  isHighCapacity: z.boolean(),
  isGeneric: z.boolean(),
  alternatives: z.array(z.string()),
});

export type Toner = z.infer<typeof tonerSchema>;
