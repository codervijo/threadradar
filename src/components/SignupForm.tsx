import { useState } from "react";

const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

export function SignupForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "New ThreadRadar waitlist signup");
    formData.append("from_name", "ThreadRadar Landing");

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("You're on the list. Watch for an email from us.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="email" className="sr-only">Work email</label>
      <input
        id="email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@agency.com"
        className="flex-1 rounded-md border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
      {/* honeypot */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Reserving…" : "Reserve a seat"}
      </button>
      {message && (
        <p
          role="status"
          className={`mt-1 text-sm sm:absolute sm:mt-16 ${
            status === "success" ? "text-accent" : "text-destructive"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default SignupForm;
