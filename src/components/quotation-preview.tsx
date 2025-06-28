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
    <div id="quotation-print-area" className="bg-white text-black p-8 font-sans text-[10px] w-full h-full overflow-auto flex flex-col relative">
        <header className="flex justify-between items-start pb-4">
            <div className="flex items-start">
                 <div className="text-gray-400 -rotate-180 origin-center absolute top-[35%] left-[25px] tracking-[.3em] text-4xl font-light" style={{writingMode: 'vertical-rl'}}>
                    QUOTATION
                </div>
                <div className="pl-16">
                    <h1 className="text-2xl font-bold text-red-600 flex items-center">
                        <span className="w-8 h-px bg-red-600 mr-2"></span>
                        FLYWHEELS <span className="font-light ml-2">THE AUTO EXPERTS</span>
                    </h1>
                    <p className="text-gray-600 mt-2">Ayush hospital road, beside Saibaba temple</p>
                    <p className="text-gray-600">Nagarjuna Nagar, Currency Nagar</p>
                    <p className="text-gray-600">Vijayawada, Andhra Pradesh -520008</p>
                    <p className="text-gray-600 font-medium mt-2">GST IN : 37AAJFF3362M1Z1</p>
                </div>
            </div>
            <div className="w-48 h-24 relative -mt-2">
                 <Image src="https://i.ibb.co/L5R9RZM/flywheels-logo.png" alt="Flywheels Logo" layout="fill" objectFit="contain" />
            </div>
        </header>

        <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t-2 border-red-500">
             <div>
                <p className="font-bold text-gray-500">Quotation No.</p>
                <p>{quotationData.quotationNumber || 'N/A'}</p>
            </div>
            <div>
                <p className="font-bold text-gray-500">Date</p>
                <p>{currentDate}</p>
            </div>
            <div>
                <p className="font-bold text-gray-500">To</p>
                <p>{quotationData.customerName || 'N/A'}</p>
            </div>
        </div>
        
        <div className="py-2 mt-4 border-t border-red-200">
             <p className="font-bold text-red-500 text-xs">Vehicle Details</p>
             <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                    <p className="font-bold">Model</p>
                    <p>{quotationData.carModel || 'N/A'}</p>
                </div>
                <div>
                    <p className="font-bold">Car Number</p>
                    <p>{quotationData.vehicleNumber || 'N/A'}</p>
                </div>
             </div>
        </div>

        <main className="flex-grow pt-4">
            <Table>
                <TableHeader>
                    <TableRow className="bg-red-500 hover:bg-red-600">
                        <TableHead className="text-white w-[50px] text-center">Serial No.</TableHead>
                        <TableHead className="text-white w-1/2">Description</TableHead>
                        <TableHead className="text-white text-right">Unit Price</TableHead>
                        <TableHead className="text-white text-right">Quantity</TableHead>
                        <TableHead className="text-white text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {quotationData.items.map((item, index) => (
                        <TableRow key={index} className="border-b-2 border-white">
                            <TableCell className="text-center bg-gray-100">{index + 1}</TableCell>
                            <TableCell className="font-medium bg-gray-100">{item.description}</TableCell>
                            <TableCell className="text-right bg-gray-100">{item.unitPrice ? formatCurrency(item.unitPrice) : ''}</TableCell>
                            <TableCell className="text-right bg-gray-100">{item.quantity || ''}</TableCell>
                            <TableCell className="text-right font-medium bg-gray-100">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="border-t-2 border-red-500">
                        <TableCell colSpan={4} className="text-right font-bold text-base">GRAND TOTAL</TableCell>
                        <TableCell className="text-right font-bold text-base">{formatCurrency(grandTotal)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </main>
        
        <div className="text-center pt-8 pb-4">
            <p className="text-red-500 font-semibold">Thanks for choosing us to serve your automotive needs!</p>
        </div>

        <footer className="text-xs text-red-500 border-t-2 border-red-500 pt-2">
            <div className="flex justify-between">
                <div>
                    <p><span className="font-bold">Tel:</span> +91-9966783333</p>
                    <p>+91-9563998998</p>
                </div>
                 <div className="text-right">
                    <p><span className="font-bold">Email:</span> flywheelsauto.vjy@gmail.com</p>
                    <p><span className="font-bold">Web:</span> www.flywheelsauto.in</p>
                </div>
            </div>
        </footer>
        <div className="absolute bottom-4 right-8 font-code text-xs text-gray-400">
            A 2LYP create
        </div>
    </div>
  );
}
