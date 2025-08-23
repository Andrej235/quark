import { RenderElementProps } from "slate-react";

export default function EmailAddressElement({
  attributes,
  children,
  element,
}: RenderElementProps) {
  if (element.type !== "email-address") return null;

  return (
    <a {...attributes} href={`mailto:${element.email}`}>
      {children}
    </a>
  );
}
