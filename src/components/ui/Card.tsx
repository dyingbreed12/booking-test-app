import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm ${className}`}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">{title}</h2>
      {children}
    </section>
  );
}
