'use server';

import { handleInvoiceModifications, HandleInvoiceModificationsInput } from '@/ai/flows/handle-invoice-modifications';
import { parseServiceDetails, ParseServiceDetailsInput, ParseServiceDetailsOutput } from '@/ai/flows/parse-service-details';
import { invoiceSchema } from '@/lib/validators';

export async function parseInvoiceAction(input: ParseServiceDetailsInput): Promise<{
    success: boolean;
    data: ParseServiceDetailsOutput | null;
    error: string | null;
}> {
    try {
        const parsedData = await parseServiceDetails(input);
        
        // Ensure numbers are formatted correctly
        const validatedItems = parsedData.items.map(item => ({
            ...item,
            quantity: Number(item.quantity) || 0,
            unitPrice: Number(item.unitPrice) || 0,
            total: Number(item.total) || 0,
        }));

        const validatedData = { ...parsedData, items: validatedItems };

        // Validate the structure of the AI output
        const a = invoiceSchema.safeParse(validatedData);
        if(!a.success) {
            console.warn("AI output validation failed", a.error.issues);
        }

        return { success: true, data: validatedData, error: null };
    } catch (error: any) {
        console.error('Error parsing service details:', error);
        return { success: false, data: null, error: `Failed to parse details: ${error.message || 'Unknown AI error'}` };
    }
}

export async function modifyInvoiceAction(input: HandleInvoiceModificationsInput) {
    try {
        const result = await handleInvoiceModifications(input);
        if (result.success && result.modifiedInvoiceDetails) {
            const parsedData = JSON.parse(result.modifiedInvoiceDetails);
            return { success: true, data: parsedData, message: result.message };
        }
        return { success: false, data: null, message: result.message || "Failed to modify invoice." };
    }
    catch (error: any) {
        console.error('Error modifying invoice:', error);
        return { success: false, data: null, message: `Failed to modify invoice: ${error.message || 'Unknown AI error'}` };
    }
}
