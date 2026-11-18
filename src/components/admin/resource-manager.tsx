"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/components/admin/providers";
import type { ColumnDef, FieldDef, ResourceConfig } from "@/lib/admin/config";
import { formatMoney, isCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

type Row = Record<string, unknown> & { id: number };
type ListResponse = { rows: Row[]; total: number; page: number; size: number };

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15";

function Cell({ col, row }: { col: ColumnDef; row: Row }) {
  const v = row[col.key];
  if (col.kind === "bool") return <span className={v ? "font-semibold text-brand" : "text-muted-foreground"}>{v ? "Yes" : "No"}</span>;
  if (col.kind === "date") return <>{v ? new Date(String(v)).toLocaleDateString() : "-"}</>;
  if (col.kind === "money") return <>{typeof v === "number" ? formatMoney(v / 100, isCurrency(row.currency) ? row.currency : "USD", { decimals: true }) : "-"}</>;
  if (col.kind === "badge")
    return v ? <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold capitalize">{String(v)}</span> : <>-</>;
  return <span className="line-clamp-1 max-w-[16rem]">{v === null || v === undefined || v === "" ? "-" : String(v)}</span>;
}

function csvCell(v: unknown) {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // neutralise spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
}

function FieldInput({ f, value, onChange }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const id = `f-${f.name}`;
  if (f.type === "checkbox")
    return (
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="size-5 accent-[var(--brand)]" />
        {f.label}
      </label>
    );
  const common = { id, value: value === null || value === undefined ? "" : String(value), placeholder: f.placeholder, className: inputCls };
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {f.label} {f.required && <span className="text-red-500">*</span>}
      </label>
      {f.type === "textarea" || f.type === "markdown" ? (
        <textarea {...common} rows={f.type === "markdown" ? 14 : 4} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, f.type === "markdown" && "font-mono text-[13px]")} />
      ) : f.type === "select" ? (
        <select {...common} onChange={(e) => onChange(e.target.value)}>
          {f.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
          value={f.type === "date" && value ? String(value).slice(0, 10) : common.value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {f.help && <p className="mt-1 text-xs text-muted-foreground">{f.help}</p>}
    </div>
  );
}

function EditorDialog({ cfg, editId, onClose }: { cfg: ResourceConfig; editId: number | "new" | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const qc = useQueryClient();
  const open = editId !== null;
  const isNew = editId === "new";

  const existing = useQuery({
    queryKey: ["admin", cfg.key, "one", editId],
    queryFn: () => api<Row>(`/api/admin/${cfg.key}/${editId}`),
    enabled: open && !isNew,
  });

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  if (!open) return <dialog ref={ref} />;

  // Remount the form whenever the target changes so its initial state comes straight from props.
  return (
    <dialog
      ref={ref}
      aria-label={`${isNew ? "New" : "Edit"} ${cfg.singular}`}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[calc(100%-1.5rem)] max-w-2xl rounded-2xl border border-border bg-card p-0 text-foreground backdrop:bg-black/60"
    >
      {isNew || existing.data ? (
        <EditorForm key={String(editId)} cfg={cfg} isNew={isNew} initial={isNew ? {} : (existing.data as Row)} onClose={onClose} onSaved={() => qc.invalidateQueries({ queryKey: ["admin", cfg.key] })} />
      ) : (
        <div className="grid h-48 place-items-center text-muted-foreground">
          {existing.isError ? "Could not load this record." : <Loader2 className="size-6 animate-spin" />}
        </div>
      )}
    </dialog>
  );
}

function EditorForm({ cfg, isNew, initial, onClose, onSaved }: { cfg: ResourceConfig; isNew: boolean; initial: Record<string, unknown>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Record<string, unknown>>(() => {
    const base: Record<string, unknown> = {};
    for (const f of cfg.fields) base[f.name] = initial[f.name] ?? (f.type === "checkbox" ? cfg.key === "demos" : f.type === "select" ? f.options?.[0] : "");
    if (isNew && cfg.key === "posts") base.published = false;
    return base;
  });
  const [error, setError] = useState<ApiError | null>(null);

  const save = useMutation({
    mutationFn: () =>
      api(isNew ? `/api/admin/${cfg.key}` : `/api/admin/${cfg.key}/${initial.id}`, {
        method: isNew ? "POST" : "PUT",
        body: JSON.stringify(form),
      }),
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (e) => setError(e as ApiError),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        save.mutate();
      }}
      className="flex max-h-[90dvh] flex-col"
    >
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-display text-xl font-bold capitalize">
          {isNew ? "New" : "Edit"} {cfg.singular}
        </h2>
        <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full hover:bg-muted">
          <X className="size-5" />
        </button>
      </header>
      <div className="space-y-4 overflow-y-auto px-6 py-5">
        {cfg.key !== "posts" && cfg.key !== "demos" && (
          <dl className="grid gap-2 rounded-xl bg-muted p-4 text-sm sm:grid-cols-2">
            {Object.entries(initial)
              .filter(([k, v]) => !["id", "status", "notes", "updatedAt", "stripeSessionId"].includes(k) && v !== null && v !== "")
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                  <dd className="break-words font-medium">{k === "amountCents" ? formatMoney(Number(v) / 100, isCurrency(initial.currency) ? initial.currency : "USD", { decimals: true }) : String(v)}</dd>
                </div>
              ))}
          </dl>
        )}
        {cfg.fields.map((f) => (
          <FieldInput key={f.name} f={f} value={form[f.name]} onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))} />
        ))}
        {error && (
          <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error.message}
          </p>
        )}
      </div>
      <footer className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button type="button" onClick={onClose} className="min-h-10 rounded-full px-5 text-sm font-semibold hover:bg-muted">
          Cancel
        </button>
        <button type="submit" disabled={save.isPending} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-strong px-6 text-sm font-semibold text-white disabled:opacity-60">
          {save.isPending && <Loader2 className="size-4 animate-spin" />} Save
        </button>
      </footer>
    </form>
  );
}

export function ResourceManager({ cfg }: { cfg: ResourceConfig }) {
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<number | "new" | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(input.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [input]);

  const list = useQuery({
    queryKey: ["admin", cfg.key, { q, page }],
    queryFn: () => api<ListResponse>(`/api/admin/${cfg.key}?q=${encodeURIComponent(q)}&page=${page}`),
    placeholderData: keepPreviousData,
  });

  const remove = useMutation({
    mutationFn: (id: number) => api(`/api/admin/${cfg.key}/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      setConfirmId(null);
      qc.invalidateQueries({ queryKey: ["admin", cfg.key] });
    },
  });

  const exportCsv = useMutation({
    mutationFn: () => api<ListResponse>(`/api/admin/${cfg.key}?q=${encodeURIComponent(q)}&size=100`),
    onSuccess: ({ rows }) => {
      const cols = cfg.columns.map((c) => c.key);
      const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: `${cfg.key}.csv` });
      a.click();
      URL.revokeObjectURL(url);
    },
  });

  const data = list.data;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.size)) : 1;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="admin-search" className="sr-only">
            {cfg.searchHint}
          </label>
          <input id="admin-search" value={input} onChange={(e) => setInput(e.target.value)} placeholder={cfg.searchHint} className={cn(inputCls, "pl-10")} />
        </div>
        {cfg.exportable && (
          <button type="button" onClick={() => exportCsv.mutate()} disabled={exportCsv.isPending} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-muted">
            <Download className="size-4" /> Export CSV
          </button>
        )}
        {cfg.canCreate && (
          <button type="button" onClick={() => setEditId("new")} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-strong px-5 text-sm font-semibold text-white">
            <Plus className="size-4" /> New {cfg.singular}
          </button>
        )}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {cfg.columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.isPending && (
              <tr>
                <td colSpan={cfg.columns.length + 1} className="px-4 py-12 text-center text-muted-foreground">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </td>
              </tr>
            )}
            {list.isError && (
              <tr>
                <td colSpan={cfg.columns.length + 1} className="px-4 py-12 text-center text-red-500">
                  {(list.error as Error).message}
                </td>
              </tr>
            )}
            {data?.rows.length === 0 && (
              <tr>
                <td colSpan={cfg.columns.length + 1} className="px-4 py-12 text-center text-muted-foreground">
                  Nothing here yet.
                </td>
              </tr>
            )}
            {data?.rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/60">
                {cfg.columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-middle">
                    <Cell col={c} row={r} />
                  </td>
                ))}
                <td className="px-4 py-2 text-right">
                  {confirmId === r.id ? (
                    <span className="inline-flex items-center gap-2 text-xs">
                      Delete?
                      <button type="button" onClick={() => remove.mutate(r.id)} className="rounded-full bg-red-600 px-3 py-1.5 font-semibold text-white">
                        {remove.isPending ? "..." : "Yes"}
                      </button>
                      <button type="button" onClick={() => setConfirmId(null)} className="rounded-full px-3 py-1.5 font-semibold hover:bg-muted">
                        No
                      </button>
                    </span>
                  ) : (
                    <span className="inline-flex gap-1">
                      <button type="button" onClick={() => setEditId(r.id)} aria-label={`Edit ${cfg.singular} ${r.id}`} className="grid size-9 place-items-center rounded-full hover:bg-muted">
                        <Pencil className="size-4" />
                      </button>
                      {cfg.canDelete && (
                        <button type="button" onClick={() => setConfirmId(r.id)} aria-label={`Delete ${cfg.singular} ${r.id}`} className="grid size-9 place-items-center rounded-full text-red-500 hover:bg-red-500/10">
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{data.total} total</span>
          <span className="inline-flex items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="min-h-9 rounded-full border border-border px-4 font-semibold disabled:opacity-40">
              Previous
            </button>
            Page {page} of {pages}
            <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="min-h-9 rounded-full border border-border px-4 font-semibold disabled:opacity-40">
              Next
            </button>
          </span>
        </div>
      )}

      <EditorDialog cfg={cfg} editId={editId} onClose={() => setEditId(null)} />
    </div>
  );
}
