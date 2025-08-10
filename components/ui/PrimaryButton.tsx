import { clx } from "@lib/utils";

export function PrimaryButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }){
  return (
    <button
      {...props}
      className={clx(
        "group relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
        "text-white shadow-[0_10px_30px_rgba(109,74,255,.35)]",
        "bg-[radial-gradient(120%_120%_at_30%_10%,#8B6CFF_0%,#6D4AFF_40%,#5233D3_100%)]",
        "ring-1 ring-[var(--ring)] hover:brightness-110 active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className
      )}
    >
      {children}
    </button>
  );
}
