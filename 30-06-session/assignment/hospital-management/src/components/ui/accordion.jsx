import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

export function Accordion({ children, className }) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function AccordionItem({ title, badge, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div 
        className="bg-slate-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex items-center justify-between pr-4">
           {title}
           {badge}
        </div>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-200", isOpen ? "transform rotate-180" : "")} />
      </div>
      {isOpen && (
        <div className="p-0 overflow-x-auto border-t border-slate-200 animate-in slide-in-from-top-1 fade-in-50 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
