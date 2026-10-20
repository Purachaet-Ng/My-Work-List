import { ChevronDown } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export const inputClass = (invalid: boolean) =>
  `w-full min-h-11 rounded-control border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground ${
    invalid ? "border-destructive" : "border-input focus-visible:border-ring"
  }`;

type ShellProps = {
  id: string;
  label: string;
  /** e.g. "12/200" */
  counter?: string;
  error?: string;
  hint?: string;
};

function Shell({ id, label, counter, error, hint, children }: ShellProps & { children: ReactNode }) {
  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="flex justify-between text-xs font-semibold">
        {label}
        {counter && <span className="font-normal text-muted-foreground">{counter}</span>}
      </label>
      {children}
      {(error || hint) && (
        <p id={`${id}-message`} className={`text-xs ${error ? "text-t1-red-700" : "text-muted-foreground"}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

const a11y = ({ id, error, hint }: ShellProps) => ({
  id,
  "aria-invalid": !!error,
  "aria-describedby": error || hint ? `${id}-message` : undefined,
});

export function TextField({ label, counter, error, hint, ...input }: ShellProps & InputHTMLAttributes<HTMLInputElement>) {
  const shell = { id: input.id, label, counter, error, hint };
  return (
    <Shell {...shell}>
      <input {...input} {...a11y(shell)} className={inputClass(!!error)} />
    </Shell>
  );
}

export function TextAreaField({
  label,
  counter,
  error,
  hint,
  ...textarea
}: ShellProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const shell = { id: textarea.id, label, counter, error, hint };
  return (
    <Shell {...shell}>
      <textarea rows={6} {...textarea} {...a11y(shell)} className={`${inputClass(!!error)} min-h-33 resize-y`} />
    </Shell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  children,
  ...select
}: ShellProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const shell = { id: select.id, label, error, hint };
  return (
    <Shell {...shell}>
      <div className="relative">
        <select {...select} {...a11y(shell)} className={`${inputClass(!!error)} appearance-none pr-10`}>
          {children}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </Shell>
  );
}
