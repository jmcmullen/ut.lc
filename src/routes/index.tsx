import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">TODO</h1>
    </div>
  )
}
