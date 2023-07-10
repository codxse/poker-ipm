export default async function request(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const data = await res.json()

    throw new Error(data?.message || `HTTP status code: ${res.status}`)
  }
  return res
}
