import { ReactNode } from "react";

/** Inner-page header band used by all non-home pages. */
export default function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-brand-950 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-brand-500 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-accent-600 blur-3xl" />
      </div>
      <div className="container-x relative py-16 lg:py-20">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-400">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-lg leading-8 text-brand-100">{intro}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
