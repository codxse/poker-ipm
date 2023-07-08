export async function POST(request: Request) {
  console.log('req', request)
  return new Response('Hello, Next.js!')
}
