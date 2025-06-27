'use client';

import { useState, useEffect } from 'react';
import type { QuotationSchema } from '@/lib/validators';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from './ui/table';
import Image from 'next/image';

interface QuotationPreviewProps {
  quotationData: QuotationSchema | null;
}

export function QuotationPreview({ quotationData }: QuotationPreviewProps) {
  const [currentDate, setCurrentDate] = useState('');

  const grandTotal = quotationData?.items.reduce((acc, item) => acc + (item.total || 0), 0) || 0;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };
  
  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
  };

  if (!quotationData) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400 rounded-sm">
        <div className="text-center">
            <p className="font-headline text-lg">Your quotation will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div id="quotation-print-area" className="bg-white text-black p-6 font-sans text-[10px] w-full h-full overflow-auto flex flex-col">
        <div className="flex justify-between items-start pb-4 border-b-2 border-blue-500">
            <div className="flex items-start">
                <div className="text-gray-700 -rotate-90 origin-bottom-left absolute bottom-[150px] left-[30px] tracking-[.2em] text-2xl font-extralight" style={{writingMode: 'vertical-rl'}}>
                    Quotation [{quotationData.quotationNumber || '000000'}]
                </div>
                <div className="pl-12">
                    <h1 className="text-2xl font-bold text-blue-600">FLYWHEELS <span className="font-light">THE AUTO EXPERTS</span></h1>
                    <p className="text-gray-600">Ayush hospital road, beside Saibaba temple</p>
                    <p className="text-gray-600">Nagarjuna Nagar, Currency Nagar</p>
                    <p className="text-gray-600">Vijayawada, Andhra Pradesh -520008</p>
                </div>
            </div>
            <div className="w-40 h-20 relative">
                 <Image src="https://i.ibb.co/L05t0YJ/flywheels-logo.png" alt="Flywheels Logo" layout="fill" objectFit="contain" />
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 text-xs border-b border-gray-300">
            <div>
                <p className="font-bold text-gray-500">Date</p>
                <p>{currentDate}</p>
            </div>
            <div>
                <p className="font-bold text-gray-500">Quotation Number</p>
                <p>{quotationData.quotationNumber || 'N/A'}</p>
            </div>
            <div>
                <p className="font-bold text-gray-500">To</p>
                <p>{quotationData.customerName || 'N/A'}</p>
            </div>
        </div>
        
        <div className="py-2">
             <p className="font-bold text-blue-500 text-xs">Vehicle Details</p>
             <p className="font-bold">{quotationData.carModel || 'N/A'}</p>
             <p>{quotationData.vehicleNumber || 'N/A'}</p>
        </div>

        <main className="flex-grow">
            <Table>
                <TableHeader>
                    <TableRow className="bg-blue-500 hover:bg-blue-600">
                        <TableHead className="text-white w-[50px]">Serial No.</TableHead>
                        <TableHead className="text-white w-1/2">Description</TableHead>
                        <TableHead className="text-white">Unit Price</TableHead>
                        <TableHead className="text-white">Quantity</TableHead>
                        <TableHead className="text-white text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {quotationData.items.map((item, index) => (
                        <TableRow key={index} className="border-b border-gray-200">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell>{item.unitPrice ? formatCurrency(item.unitPrice) : ''}</TableCell>
                            <TableCell>{item.quantity || ''}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="border-t-2 border-blue-500">
                        <TableCell colSpan={4} className="text-right font-bold text-lg">ESTIMATED TOTAL</TableCell>
                        <TableCell className="text-right font-bold text-lg">{formatCurrency(grandTotal)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </main>
        
        <div className="text-center py-4 text-xs">
            <p>This is a quotation and not a final invoice. Prices are subject to change.</p>
        </div>

        <footer className="text-xs text-blue-500 border-t-2 border-blue-500 pt-2">
            <div className="flex justify-between">
                <div>
                    <p>Tel: + 91-9966783333</p>
                    <p>+ 91-9563998998</p>
                </div>
                 <div className="text-right">
                    <p>Email: flywheelsauto.vjy@gmail.com</p>
                    <p>Web: www.flywheelsauto.in</p>
                </div>
            </div>
             <div className="text-right font-code text-xs text-gray-500 mt-2">
                a 2LYP create
            </div>
        </footer>
    </div>
  );
}
