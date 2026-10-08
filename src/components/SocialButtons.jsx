import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

// Set these in .env (see README). Without them the buttons still show, and explain what is missing.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI || `${window.location.origin}/`;

// A provider's button is only shown once its client id is set, so visitors never see a button that cannot work.
export const hasSocial = Boolean(GOOGLE_CLIENT_ID || APPLE_CLIENT_ID);

const scripts = {};
const loadScript = (src) =>
  (scripts[src] ||= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = resolve;
    s.onerror = () => { delete scripts[src]; reject(new Error("Could not load the sign-in service. Check your connection.")); };
    document.head.appendChild(s);
  }));

const AppleMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.4 12.7c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9s-2-.9-3.3-.9c-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.8-1.1-2.8-4zM13.9 5.2c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.2 1.2.1 2.3-.6 3-1.5z" />
  </svg>
);

export default function SocialButtons({ onError }) {
  const { social } = useAuth();
  const googleBox = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (fn) => {
    setBusy(true); onError("");
    try { await fn(); }
    catch (err) { if (err?.error !== "popup_closed_by_user" && err?.error !== "user_cancelled_authorize") onError(err.message || "Sign-in failed. Please try again."); }
    finally { setBusy(false); }
  };

  // Google draws its own official button; it hands back an ID token
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let gone = false;
    loadScript("https://accounts.google.com/gsi/client")
      .then(() => {
        if (gone || !googleBox.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (r) => run(() => social("google", { credential: r.credential }))
        });
        window.google.accounts.id.renderButton(googleBox.current, {
          type: "standard", theme: "outline", size: "large", text: "continue_with",
          shape: "rectangular", logo_alignment: "left", width: googleBox.current.offsetWidth || 340
        });
        setGoogleReady(true);
      })
      .catch((e) => onError(e.message));
    return () => { gone = true; };
  }, []); // eslint-disable-line

  const apple = () => run(async () => {
    if (!APPLE_CLIENT_ID) throw new Error("Apple sign-in is not set up yet (missing VITE_APPLE_CLIENT_ID).");
    await loadScript("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js");
    window.AppleID.auth.init({ clientId: APPLE_CLIENT_ID, scope: "name email", redirectURI: APPLE_REDIRECT_URI, usePopup: true });
    const r = await window.AppleID.auth.signIn();
    await social("apple", { idToken: r.authorization.id_token, name: r.user?.name });
  });

  if (!hasSocial) return null;

  return (
    <div className="social">
      {GOOGLE_CLIENT_ID && <div className="social__google" ref={googleBox} aria-busy={!googleReady} />}
      {APPLE_CLIENT_ID && (
        <button type="button" className="social__btn social__btn--apple" disabled={busy} onClick={apple}>
          <AppleMark /> Continue with Apple
        </button>
      )}
    </div>
  );
}
