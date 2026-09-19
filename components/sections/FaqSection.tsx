import FaqAccordion, { type FaqItem } from "./FaqAccordion";

export default function FaqSection({
  eyebrow,
  heading,
  items,
}: {
  eyebrow: string;
  heading: string;
  items: FaqItem[];
}) {
  return (
    <section id="faq" className="section-y relative overflow-hidden">
      {/* Resplandor ambiental de iluminación */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-500/20 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-accent-cyan/15 blur-[130px]" />

      <div className="container relative z-10">
        <div className="mb-12 text-center">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mx-auto mt-6 max-w-2xl text-balance font-display text-3xl font-bold leading-tight md:text-4xl">
            {heading}
          </h2>
        </div>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
