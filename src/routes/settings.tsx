import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef } from 'react'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const modalRef = useRef<HTMLDialogElement>(null)
  return (
    <>
      <header className="bg-base-100 h-16 flex justify-between md:justify-center items-center p-2">
        <Link href="/" className="block md:hidden">
          <ChevronLeftIcon
            title="Back Home"
            role="presentation"
            className="btn btn-circle border border-base-300"
          />
        </Link>
        <h1 className="text-xl font-bold">Settings</h1>
        <div className="w-16 md:hidden" role="presentation"></div>
      </header>
      <main className="container h-full mx-auto flex flex-col justify-around items-center">
        <button
          className="btn btn-error"
          onClick={() => modalRef.current?.showModal()}
        >
          Clear Data
        </button>
      </main>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <strong className="text-lg font-bold">
            Are you sure you want to remove all your data?
          </strong>
          <p>All your progress will be lost definitely.</p>
          <form method="dialog" className="modal-action">
            <button className="btn btn-neutral">Cancel</button>
            <button
              className="btn btn-error"
              onClick={() => {
                window.localStorage.clear()
                window.location.reload()
              }}
            >
              Confirm
            </button>
          </form>
        </div>
      </dialog>
    </>
  )
}
