// ============================================================
// Robot Teaching Knowledge App — Cases Context
// ============================================================

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  getAllCases,
  createCase,
  updateCase,
  deleteCase,
  filterCases,
  calcStats,
} from "./store";
import type { Case, CaseInput, FilterState } from "./types";

interface CasesContextValue {
  cases: Case[];
  filteredCases: Case[];
  filter: FilterState;
  stats: ReturnType<typeof calcStats>;
  loading: boolean;
  setFilter: (filter: FilterState) => void;
  addCase: (input: Omit<CaseInput, "caseId">) => Promise<Case>;
  editCase: (id: string, input: Partial<CaseInput>) => Promise<Case | null>;
  removeCase: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultFilter: FilterState = {
  types: [],
  levels: [],
  robot: "",
  customerCode: "",
  searchText: "",
};

const CasesContext = createContext<CasesContextValue | null>(null);

export function CasesProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getAllCases();
    setCases(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCase = useCallback(
    async (input: Omit<CaseInput, "caseId">) => {
      const newCase = await createCase(input);
      setCases((prev) => [newCase, ...prev]);
      return newCase;
    },
    []
  );

  const editCase = useCallback(
    async (id: string, input: Partial<CaseInput>) => {
      const updated = await updateCase(id, input);
      if (updated) {
        setCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
      }
      return updated;
    },
    []
  );

  const removeCase = useCallback(async (id: string) => {
    await deleteCase(id);
    setCases((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const filteredCases = filterCases(cases, filter);
  const stats = calcStats(cases);

  return (
    <CasesContext.Provider
      value={{
        cases,
        filteredCases,
        filter,
        stats,
        loading,
        setFilter,
        addCase,
        editCase,
        removeCase,
        refresh,
      }}
    >
      {children}
    </CasesContext.Provider>
  );
}

export function useCases(): CasesContextValue {
  const ctx = useContext(CasesContext);
  if (!ctx) throw new Error("useCases must be used within CasesProvider");
  return ctx;
}
