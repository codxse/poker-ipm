export default function App() {
  return (
    <div>
      <a href={`${process.env.API_ENDPOINT}/auth/google`}>Login with Google</a>
    </div>
  )
}
