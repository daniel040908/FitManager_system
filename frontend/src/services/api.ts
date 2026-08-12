const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export async function api<T>(path:string, options:RequestInit = {}):Promise<T> {
  const token = localStorage.getItem('fitmanager_token');
  const response = await fetch(`${BASE}${path}`, { ...options, headers: { 'Content-Type':'application/json', ...(token ? {Authorization:`Bearer ${token}`} : {}), ...(options.headers || {}) } });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.erro || 'Erro na requisição');
  return data as T;
}
export const get = <T,>(path:string) => api<T>(path);
export const post = <T,>(path:string, body:unknown) => api<T>(path,{method:'POST',body:JSON.stringify(body)});
