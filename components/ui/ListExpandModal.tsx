"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Grid, Sparkles, Check } from "lucide-react";

export interface ListExpandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string | React.ReactNode;
  badge?: string;
}

interface ListExpandModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  items: ListExpandItem[];
  selectedId?: string;
  onSelect: (item: ListExpandItem) => void;
}

export default function ListExpandModal({
  isOpen,
  onClose,
  title,
  subtitle,
  items,
  selectedId,
  onSelect,
}: ListExpandModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-base-950/80 backdrop-blur-xl"
          />

          {/* Modal Content Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 flex flex-col max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-accent-cyan/30 bg-gradient-to-br from-[#0e1642]/95 via-[#080d2b]/95 to-[#120a2e]/95 shadow-[0_0_60px_-10px_rgba(94,230,216,0.25)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan shadow-[0_0_15px_-3px_rgba(94,230,216,0.3)]">
                  <Grid className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white md:text-2xl">{title}</h3>
                  {subtitle && <p className="text-xs text-slate-300">{subtitle}</p>}
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Toolbar */}
            <div className="border-b border-white/10 p-4 md:px-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar opción por nombre o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/[0.05] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 transition-all focus:border-accent-cyan focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Grid Body */}
            <div className="no-scrollbar overflow-y-auto p-4 md:p-6">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm">No se encontraron opciones para &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                        className={`group relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-accent-cyan bg-accent-cyan/20 text-white shadow-[0_0_20px_-5px_rgba(94,230,216,0.3)] scale-[1.02]"
                            : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-accent-cyan/40 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {item.icon && (
                          <div className="mt-0.5 shrink-0 text-accent-cyan">
                            {typeof item.icon === "string" ? (
                              <div dangerouslySetInnerHTML={{ __html: item.icon }} className="h-5 w-5 [&_svg]:h-5 [&_svg]:w-5" />
                            ) : (
                              item.icon
                            )}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate font-display text-sm font-semibold text-white">
                              {item.title}
                            </span>
                            {isSelected && (
                              <Check className="h-4 w-4 shrink-0 text-accent-cyan" />
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="mt-1 line-clamp-2 text-xs text-slate-300">
                              {item.subtitle}
                            </p>
                          )}
                          {item.badge && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-brand-400/30 bg-brand-500/15 px-2.5 py-0.5 text-[10px] font-medium text-accent-cyan">
                              <Sparkles className="h-2.5 w-2.5" />
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 bg-base-950/40 p-4 px-6 text-xs text-slate-400">
              <span>{filteredItems.length} opciones disponibles</span>
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
