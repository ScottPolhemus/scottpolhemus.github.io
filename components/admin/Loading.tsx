import { Spinner } from '@nextui-org/spinner'

export default function AdminLoading() {
  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
