// src/ai/flows/handle-invoice-modifications.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for handling invoice modifications based on user commands.
 *
 * - handleInvoiceModifications - A function that processes user commands to add, remove, or update invoice line items.
 * - HandleInvoiceModificationsInput - The input type for the handleInvoiceModifications function.
 * - HandleInvoiceModificationsOutput - The return type for the handleInvoiceModifications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleInvoiceModificationsInputSchema = z.object({
  command: z.string().describe('The command to execute (add, remove, or update).'),
  invoiceDetails: z.string().describe('The current invoice details as a string.'),
  lineItemDetails: z.string().describe('Details of the line item to add, remove, or update.'),
});

export type HandleInvoiceModificationsInput = z.infer<typeof HandleInvoiceModificationsInputSchema>;

const HandleInvoiceModificationsOutputSchema = z.object({
  modifiedInvoiceDetails: z.string().describe('The modified invoice details after applying the command.'),
  success: z.boolean().describe('Indicates whether the modification was successful.'),
  message: z.string().describe('A message providing feedback on the modification attempt.'),
});

export type HandleInvoiceModificationsOutput = z.infer<typeof HandleInvoiceModificationsOutputSchema>;

export async function handleInvoiceModifications(input: HandleInvoiceModificationsInput): Promise<HandleInvoiceModificationsOutput> {
  return handleInvoiceModificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleInvoiceModificationsPrompt',
  input: {schema: HandleInvoiceModificationsInputSchema},
  output: {schema: HandleInvoiceModificationsOutputSchema},
  prompt: `You are an AI assistant that helps modify invoice details based on user commands.

  The user will provide a command ('add', 'remove', or 'update'), the current invoice details, and the line item details.
  Your task is to modify the invoice details based on the command and line item details.
  Return the modified invoice details, a success flag, and a message indicating the result of the modification.

  Command: {{{command}}}
  Current Invoice Details: {{{invoiceDetails}}}
  Line Item Details: {{{lineItemDetails}}}

  Output in a JSON format:
  {
    "modifiedInvoiceDetails": "The modified invoice details.",
    "success": true or false,
    "message": "A message indicating the result of the modification."
  }`,
});

const handleInvoiceModificationsFlow = ai.defineFlow(
  {
    name: 'handleInvoiceModificationsFlow',
    inputSchema: HandleInvoiceModificationsInputSchema,
    outputSchema: HandleInvoiceModificationsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('Failed to modify invoice details.');
      }
      return output;
    } catch (error: any) {
      console.error('Error modifying invoice details:', error);
      return {
        modifiedInvoiceDetails: input.invoiceDetails,
        success: false,
        message: `Failed to modify invoice details: ${error.message || 'Unknown error'}`,
      };
    }
  }
);
