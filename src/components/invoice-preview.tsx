
'use client';

import { useState, useEffect } from 'react';
import type { InvoiceSchema } from '@/lib/validators';
import { Card, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Logo } from './icons';

interface InvoicePreviewProps {
  invoiceData: InvoiceSchema | null;
}

export function InvoicePreview({ invoiceData }: InvoicePreviewProps) {
  const [currentDate, setCurrentDate] = useState('');

  const subtotal = invoiceData?.items.reduce((acc, item) => acc + item.total, 0) || 0;
  // Assuming a 5% tax for demonstration
  const tax = subtotal * 0.05; 
  const grandTotal = subtotal + tax;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!invoiceData) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400 rounded-sm">
        <div className="text-center">
            <p className="font-headline text-lg">Your invoice will appear here</p>
            <p className="text-sm">Start by pasting your service notes.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="invoice-print-area" className="bg-white text-black p-8 font-body text-sm w-full h-full overflow-auto">
        <header className="flex justify-between items-start mb-8">
            <div>
                <Logo className="h-12 w-12 text-primary mb-2" />
                <h1 className="font-headline text-2xl font-bold text-gray-800">InvoiceCraft Garage</h1>
                <p className="text-gray-500">123 Auto Lane, Service City, 500081</p>
                <p className="text-gray-500">contact@invoicecraft.com</p>
            </div>
            <div className="text-right">
                <h2 className="font-headline text-3xl font-bold uppercase text-primary">Invoice</h2>
                <p className="text-gray-600"><strong>Invoice #:</strong> {invoiceData.vehicleNumber || 'N/A'}</p>
                <p className="text-gray-600"><strong>Date:</strong> {currentDate}</p>
            </div>
        </header>

        <section className="mb-8">
            <h3 className="font-headline text-base font-semibold border-b-2 border-primary pb-1 mb-2 text-gray-700">Bill To:</h3>
            <p className="font-bold text-gray-800">{invoiceData.customerName || 'N/A'}</p>
            <p className="text-gray-600">{invoiceData.carModel || 'N/A'}</p>
        </section>

        <section className="mb-8">
            <Table>
                <TableHeader>
                    <TableRow className="bg-primary/10 hover:bg-primary/20">
                        <TableHead className="font-headline text-primary">Item Description</TableHead>
                        <TableHead className="text-right font-headline text-primary">Quantity</TableHead>
                        <TableHead className="text-right font-headline text-primary">Unit Price</TableHead>
                        <TableHead className="text-right font-headline text-primary">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoiceData.items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium text-gray-800">{item.description}</TableCell>
                            <TableCell className="text-right text-gray-600">{item.quantity}</TableCell>
                            <TableCell className="text-right text-gray-600">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right font-semibold text-gray-800">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>

        <section className="flex justify-end mb-8">
            <div className="w-full max-w-xs space-y-2 text-gray-700">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxes (5%)</span>
                    <span>{formatCurrency(tax)}</span>
                </div>
                <Separator className="bg-gray-300" />
                <div className="flex justify-between font-bold text-xl text-primary font-headline">
                    <span>Grand Total</span>
                    <span>{formatCurrency(grandTotal)}</span>
                </div>
            </div>
        </section>

        <footer className="text-center text-xs text-gray-500 border-t pt-4">
            <p>Thank you for your business!</p>
            <p>Payments can be made via UPI, cash, or card.</p>
        </footer>
    </div>
  );
}
