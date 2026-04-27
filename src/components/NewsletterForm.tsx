"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a valid email");
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email");
    } else {
      setError("");
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <p className="text-primary font-label text-sm uppercase tracking-wider">
        Thank you for subscribing!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ENTER YOUR EMAIL"
        className="flex-grow bg-surface-container-highest border-b-2 border-outline-variant text-on-surface focus:ring-0 focus:border-primary font-label text-sm uppercase tracking-wider px-6 py-4 rounded-t-sm outline-none transition-colors placeholder:text-outline/50"
      />
      <button
        type="submit"
        className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-label uppercase font-bold tracking-wider rounded-sm transition-all duration-300 btn-primary-glow shrink-0"
      >
        Subscribe
      </button>
      {error && (
        <p className="text-error text-sm mt-2">{error}</p>
      )}
    </form>
  );
}
