# **App Name**: InvoiceCraft Bot

## Core Features:

- Intelligent Parsing: Intelligently parse service details (vehicle number, customer name, car model, itemized list with unit price, quantity, total) from free-form text in English or Telugu, using Gemini Pro as a tool to understand user intent.
- Interactive Prompts: Interactively prompt the user for missing essential fields like vehicle number or customer name.
- PDF Invoice Generation: Generate a professional-looking PDF invoice based on parsed data, named after the vehicle number.
- DOCX Invoice Generation: Generate a Microsoft Word (.docx) invoice upon user request.
- Command Handling: Enable 'add', 'remove', and 'update' commands for dynamic modification of invoice line items using Gemini Pro as a tool.
- Multilingual Support: Support both Telugu and English language input, using basic translation or understanding capabilities to provide consistent functionality.
- Secure Credential Handling: Securely manage the Telegram bot token and Gemini API key using a .env file.

## Style Guidelines:

- Primary color: Deep sky blue (#3399FF), for a sense of reliability and professionalism in financial transactions.
- Background color: Very light blue (#E0F7FA) to maintain a clean and professional look without causing eye strain.
- Accent color: Medium purple (#9966FF), used to highlight interactive elements and important information within the invoice.
- Body font: 'PT Sans', a humanist sans-serif, to ensure readability for both the invoice content and the conversational aspects of the bot.
- Headline font: 'Space Grotesk', to lend a technological/modern flair to the invoice content.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use minimalist icons for commands and options, focusing on clarity and ease of use.
- Employ a clear and structured layout for both the bot's messages and the generated invoices, ensuring information is easily accessible and well-organized.