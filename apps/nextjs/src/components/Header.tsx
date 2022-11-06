import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Modal from "./Modal";
import SignIn from "./SignIn";

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [showSignIn, setShowSignIn] = useState(false);
  return (
    <header>
      <div>
        <p
          className={`${!session && loading ? "-top-8 opacity-0" : undefined}`}
        >
          {!session && (
            <>
              <button onClick={() => setShowSignIn(true)}>
                <span className={``}>Sign In</span>
              </button>
              <Modal open={showSignIn} setOpen={setShowSignIn}>
                <SignIn />
              </Modal>
            </>
          )}
          {session?.user && (
            <>
              <span className={``}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.id}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                className={``}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={``}>
          <li className={``}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
