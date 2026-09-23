import { useCallback, useEffect, useState } from "react";

export type Student = { id: string; name: string; age: string; height: string; weight: string; gender: "female" | "male" };

export type FmData = {
  values: Record<string, string>;
  students: Student[];
  academy: Record<string, string>;
  profile: Record<string, string>;
};

const KEY = "fitmanager-data";
const empty: FmData = { values: {}, students: [], academy: {}, profile: {} };

let cache: FmData = empty;
const listeners = new Set<() => void>();

function load(): FmData {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...(JSON.parse(raw) as Partial<FmData>) };
  } catch {
    return empty;
  }
}

function persist(next: FmData) {
  cache = next;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function useFmData() {
  const [data, setData] = useState<FmData>(empty);

  useEffect(() => {
    cache = load();
    setData(cache);
    const listener = () => setData({ ...cache });
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const setValue = useCallback((key: string, value: string) => {
    persist({ ...cache, values: { ...cache.values, [key]: value } });
  }, []);

  const setField = useCallback((group: "academy" | "profile", key: string, value: string) => {
    persist({ ...cache, [group]: { ...cache[group], [key]: value } });
  }, []);

  const addStudent = useCallback((student: Omit<Student, "id">) => {
    persist({ ...cache, students: [...cache.students, { ...student, id: crypto.randomUUID() }] });
  }, []);

  const removeStudent = useCallback((id: string) => {
    persist({ ...cache, students: cache.students.filter((s) => s.id !== id) });
  }, []);

  const resetAll = useCallback(() => { persist(empty); }, []);

  return { data, setValue, setField, addStudent, removeStudent, resetAll };
}
