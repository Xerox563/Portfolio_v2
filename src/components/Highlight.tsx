/** Renders text with the last `words` words wrapped in the serif gradient style. */
export function Highlight({ text, words = 2 }: { text: string; words?: number }) {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= words) {
    return <span className="serif grad-text">{parts.join(" ")}</span>;
  }
  const head = parts.slice(0, -words).join(" ");
  const tail = parts.slice(-words).join(" ");
  return (
    <>
      {head} <span className="serif grad-text">{tail}</span>
    </>
  );
}