export async function api(path, opts = {}) {
  const res = await fetch(import.meta.env.VITE_API + path, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    credentials: "include",
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
