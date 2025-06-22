// src/app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { parseInvoiceAction } from '@/app/actions';

// It's recommended to set the webhook via a manual cURL command or a setup script
// rather than in the code, especially in a serverless environment.
//
// To set the webhook, run the following command in your terminal,
// replacing <YOUR_BOT_TOKEN> and <YOUR_PUBLIC_URL>:
// curl -F "url=<YOUR_PUBLIC_URL>/api/telegram/webhook" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
//
// Example:
// curl -F "url=https://your-app-name.web.app/api/telegram/webhook" https://api.telegram.org/bot123456:ABC-DEF123456/setWebhook

const token = process.env.TELEGRAM_BOT_TOKEN;
const publicUrl = process.env.PUBLIC_URL;

if (!token) {
    console.warn("TELEGRAM_BOT_TOKEN is not set. The Telegram bot will not work.");
}

if (!publicUrl) {
    console.warn("PUBLIC_URL is not set. PDF link generation from the bot will not work.");
}

const bot = token ? new TelegramBot(token) : null;

export async function POST(req: NextRequest) {
    if (!bot) {
        return NextResponse.json({ error: 'Telegram bot not configured.' }, { status: 500 });
    }
    
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
        return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const message = body.message;

        if (message && message.text) {
            const chatId = message.chat.id;
            const text = message.text;
            
            await bot.sendMessage(chatId, 'Parsing your invoice details, please wait...');

            // Use the existing server action to parse the details
            const result = await parseInvoiceAction({ text });

            if (result.success && result.data) {
                const { customerName, vehicleNumber, carModel, items } = result.data;
                
                let responseText = `*Invoice Details Parsed Successfully*:\n\n`;
                responseText += `*Customer:* ${customerName}\n`;
                responseText += `*Vehicle:* ${vehicleNumber}\n`;
                responseText += `*Model:* ${carModel}\n\n`;
                responseText += `*Items*:\n`;

                let totalAmount = 0;
                items.forEach(item => {
                    responseText += `- ${item.description}: ${item.total}\n`;
                    totalAmount += item.total;
                });

                responseText += `\n*Grand Total:* ${totalAmount.toFixed(2)}`;
                
                const replyOptions: TelegramBot.SendMessageOptions = {
                    parse_mode: 'Markdown'
                };

                if (publicUrl) {
                    const jsonData = JSON.stringify(result.data);
                    const base64Data = Buffer.from(jsonData).toString('base64');
                    const invoiceUrl = `${publicUrl}/view-invoice?data=${base64Data}`;

                    replyOptions.reply_markup = {
                        inline_keyboard: [
                            [{ text: '📄 View and Print PDF', url: invoiceUrl }]
                        ]
                    };
                } else {
                     responseText += `\n\n(Set the PUBLIC_URL environment variable to enable PDF link generation)`;
                }

                await bot.sendMessage(chatId, responseText, replyOptions);

            } else {
                await bot.sendMessage(chatId, `Sorry, I couldn't parse that. Error: ${result.error}`);
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Error processing Telegram update:', error);
        return NextResponse.json({ error: 'Failed to process update' }, { status: 500 });
    }
}
