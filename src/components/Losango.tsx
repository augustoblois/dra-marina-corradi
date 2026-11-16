/** O losango dourado dos rótulos e listas: o mesmo detalhe do selo da Corradi Derma. */
export function Losango({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-[5px] w-[5px] shrink-0 rotate-45 bg-brand-gold ${className}`}
    />
  );
}
