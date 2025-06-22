'use server';

import { handleInvoiceModifications, HandleInvoiceModificationsInput } from '@/ai/flows/handle-invoice-modifications';
import { parseServiceDetails, ParseServiceDetailsInput, ParseServiceDetailsOutput } from '@/ai/flows/parse-service-details';
import { invoiceSchema } from '@/lib/validators';

const API_KEY_ERROR_MESSAGE = "AI features require a Gemini API key. Please add `GEMINI_API_KEY=your_key` to the .env file and restart the server. You can get a key from Google AI Studio.";

function isApiKeyMissing() {
    return !process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY;
}

export async function parseInvoiceAction(input: ParseServiceDetailsInput): Promise<{
    success: boolean;
    data: ParseServiceDetailsOutput | null;
    error: string | null;
}> {
    if (isApiKeyMissing()) {
        console.error(API_KEY_ERROR_MESSAGE);
        return { success: false, data: null, error: API_KEY_ERROR_MESSAGE };
    }

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
    if (isApiKeyMissing()) {
        console.error(API_KEY_ERROR_MESSAGE);
        return { success: false, data: null, message: API_KEY_ERROR_MESSAGE };
    }
    
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
