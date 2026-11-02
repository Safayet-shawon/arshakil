import { Fragment, cloneElement, isValidElement, type ReactNode } from "react";

/** Punctuation that gets the mustard colour across the site: , . - – — ' ’ ; : & */
const PUNCT = /([,.\-–—'’;:&]+)/;

function mark(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    return node.split(PUNCT).map((part, i) =>
      i % 2 ? <span key={i} className="text-accent [-webkit-text-stroke:0]">{part}</span> : part);
  }
  if (Array.isArray(node)) return node.map((n, i) => <Fragment key={i}>{mark(n)}</Fragment>);
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children != null) {
    return cloneElement(node, undefined, mark(node.props.children));
  }
  return node;
}

/** Wrap any text to turn its punctuation mustard. */
export default function Hl({ children }: { children: ReactNode }) {
  return <>{mark(children)}</>;
}
