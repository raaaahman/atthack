export function ErrorFallback() {
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center">
      <p className="my-4">Oops. Something went wrong.</p>
      <button
        onClick={() => window.location.assign("/")}
        className="block btn btn-neutral btn-md"
      >
        Reload
      </button>
    </div>
  );
}
