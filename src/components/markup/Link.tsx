import clsx from "clsx";
import { PropsWithChildren, useRef } from "react";

type LinkProps = {
  href?: string;
  modalContent?: string;
  modalTitle?: string;
};

export function Link({
  href,
  children,
  modalContent,
  modalTitle,
}: PropsWithChildren<LinkProps>) {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <a
        href="#"
        title={href}
        onClick={(event) => {
          event.preventDefault();
          modalRef.current?.showModal();
        }}
        className="font-semibold text-secondary underline underline-offset-2 decoration-dotted decoration-2"
      >
        {children}
      </a>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box bg-neutral-100">
          <h3
            className={clsx(
              "font-bold text-lg text-center rounded-xl p-4 -m-4",
              modalTitle
                ? "bg-info text-info-content"
                : " bg-warning text-warning-content"
            )}
          >
            {modalTitle ? modalTitle : "Security Alert!"}
          </h3>
          <p className="py-8 text-neutral">
            {modalContent ? (
              modalContent
            ) : (
              <>
                <strong className="font-bold">Warning:</strong> This link can't
                be trusted. We blocking it for your security.
              </>
            )}
          </p>
          <div className="modal-action justify-center">
            <form method="dialog">
              {modalContent ? (
                <>
                  <button className="btn btn-neutral mx-2">Cancel</button>
                  <button className="btn btn-success mx-2">Confirm</button>
                </>
              ) : (
                <button className="btn btn-success">Back to safety</button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
