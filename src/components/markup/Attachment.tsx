import { PropsWithChildren, useEffect, useState } from "react";

type AttachmentProps = {
  path?: string;
};

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "svg", "webp"];

export function Attachment({
  path,
  children,
}: PropsWithChildren<AttachmentProps>) {
  const extension = path?.match(/\.(\w+)$/);
  const type =
    extension && IMAGE_EXTENSIONS.includes(extension[1]) ? "image" : "other";

  const [resource, setResource] = useState<string>();

  useEffect(() => {
    if (path) {
      const controller = new AbortController();

      fetch(path, { signal: controller.signal }).then((response) => {
        if (type === "image") {
          response
            .blob()
            .then((blob) => setResource(URL.createObjectURL(blob)));
        }
      });

      return () => {
        controller.abort();
        if (resource) URL.revokeObjectURL(resource);
      };
    }
  }, [path, type]);

  return resource ? (
    type === "image" ? (
      <img
        className="max-h-72 max-w-96"
        alt={typeof children === "string" ? children : "An image."}
        src={resource}
      />
    ) : (
      <div>{resource?.toString()}</div>
    )
  ) : (
    children
  );
}
