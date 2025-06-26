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
  invoiceDetails: z.string().describe('The current invoice details, either as a JSON string or a human-readable summary.'),
  modificationRequest: z.string().describe('The user\'s request to modify the invoice, e.g., "add 2 wiper blades for 500 each" or "remove engine oil".'),
});

export type HandleInvoiceModificationsInput = z.infer<typeof HandleInvoiceModificationsInputSchema>;

const HandleInvoiceModificationsOutputSchema = z.object({
  modifiedInvoiceDetails: z.string().describe('The modified invoice details after applying the command. This must be a valid JSON string.'),
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
  prompt: `You are an AI assistant that helps modify invoice details based on a user's natural language request.

The user will provide the current invoice details (which could be a JSON object string, or a human-readable text summary) and a modification request.

Your task is to understand the modification request (which could be to add, remove, or update one or more line items) and apply it to the invoice details.

If the original 'invoiceDetails' was not in JSON format, you must first parse it into a structured format.

The final, modified invoice must be returned as a JSON string in the 'modifiedInvoiceDetails' field. This JSON string MUST conform to the following structure:
{
  "invoiceNumber": string,
  "vehicleNumber": string,
  "customerName": string,
  "carModel": string,
  "items": [
    {
      "description": string,
      "quantity": number (optional),
      "unitPrice": number (optional),
      "total": number
    }
  ]
}
Recalculate totals if necessary. Ensure all numbers in the final JSON are just numbers, not strings.

Current Invoice Details:
{{{invoiceDetails}}}

User's Modification Request:
{{{modificationRequest}}}

Respond with the full output object, including the 'success' flag and a 'message' describing the action taken (e.g., "Successfully added 2 wiper blades.").`,
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
      // Validate that the output is actually a parsable JSON
      JSON.parse(output.modifiedInvoiceDetails);
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
