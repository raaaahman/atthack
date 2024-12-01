import { PropsWithChildren, useEffect, useState } from "react";

type AttachmentProps = {
  src?: string;
};

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "svg", "webp", "gif"];

export function Attachment({ src, children }: PropsWithChildren<AttachmentProps>) {
  const extension = src?.match(/\.(\w+)$/);
  const type =
    extension && IMAGE_EXTENSIONS.includes(extension[1]) ? "image" : "other";

  const [resource, setResource] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();

    if (src && !resource) {
      fetch(src, { signal: controller.signal })
        .then(() => {
          if (type === "image") {
            setResource(src);
          }
        })
        .catch((error) => {
          if (
            !(error instanceof Error && error.message.startsWith("AbortError"))
          )
            console.log(error);
        });
    }

    return () => {
      controller.abort();
      if (resource) URL.revokeObjectURL(resource);
    };
  }, [src, type, resource]);

  return type === "image" ? (
    resource ? (
      <img
        className="w-full object-contain max-h-72 max-w-96 rounded-md"
        alt={typeof children === "string" ? children : "An image."}
        src={resource}
      />
    ) : (
      <div className="skeleton h-72 w-96" />
    )
  ) : resource ? (
    <div>{resource.toString()}</div>
  ) : (
    children
  );
}
