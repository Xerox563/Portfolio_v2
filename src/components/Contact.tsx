import { useState } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";
import { useContent } from "../lib/content";
import { sendContactMessage } from "../lib/contact";

export function Contact() {
  const { identity, socials } = useContent();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message) return;

    setStatus("sending");
    setError("");
    try {
      await sendContactMessage({ name, email, message });
      setStatus("done");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Message could not be sent. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="contact__bg" aria-hidden>
        <div className="blob" style={{ top: "10%", left: "10%", background: "#c8ff5e", width: 360, height: 360, opacity: 0.18 }} />
        <div className="blob" style={{ bottom: "0%", right: "5%", background: "#9b7bff", width: 380, height: 380, opacity: 0.2 }} />
      </div>

      <div className="container contact__inner">
        <Reveal>
          <span className="eyebrow">07 — Contact</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="contact__heading display">
            Let’s make something <span className="serif grad-text">memorable</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="contact__lede">
            Looking for a design engineer to lead your next launch — a brand site that moves, a
            product that feels, or a one-of-one experiment? I take on two to three projects per
            quarter.
          </p>
        </Reveal>

        <div className="contact__grid">
          <form className="contact__form glass" onSubmit={onSubmit}>
            <FloatingInput label="Your name" id="name" required />
            <FloatingInput label="Email" id="email" type="email" required />
            <FloatingInput label="Tell me about the project" id="message" textarea />
            <div className="contact__actions">
              <Magnetic strength={0.25}>
                <button
                  className="btn contact__submit"
                  type="submit"
                  disabled={status === "sending"}
                  data-cursor="hover"
                >
                  <span className="btn__fill" />
                  {status === "done" ? "Message sent ✓" : status === "sending" ? "Sending…" : "Send message"}
                </button>
              </Magnetic>
              <span className="contact__hint">Or write to <a className="link-underline" href={`mailto:${identity.email}`}>{identity.email}</a></span>
            </div>
            {status === "done" && (
              <motion.p
                className="contact__success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Thanks — I’ll get back to you within two working days.
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                className="contact__success contact__error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </form>

          <aside className="contact__aside">
            <Reveal>
              <h3 className="contact__aside-title">Elsewhere</h3>
              <ul className="contact__socials">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="contact__social" data-cursor="hover">
                      <span>{s.label}</span>
                      <span className="contact__social-arrow" aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="contact__availability glass">
                <span className="status">
                  <span className="status__dot" /> {identity.availability}
                </span>
                <p>{identity.availabilityNote}</p>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  );
}

function FloatingInput({
  label,
  id,
  type = "text",
  required,
  textarea,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const [filled, setFilled] = useState(false);

  const common = {
    id,
    name: id,
    required,
    "data-cursor": "text",
    onFocus: () => setFilled(true),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFilled(e.target.value.trim().length > 0),
  };

  return (
    <label className={`field ${filled ? "field--filled" : ""}`}>
      {textarea ? (
        <textarea rows={4} {...common} />
      ) : (
        <input type={type} {...common} />
      )}
      <span className="field__label">{label}{required ? "" : ""}</span>
      <span className="field__line" />
    </label>
  );
}
