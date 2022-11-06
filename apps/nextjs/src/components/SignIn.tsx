import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto"
          src="/logo.png"
          alt=""
          height={12}
          width={12}
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => signIn("google")}
          >
            <span className="sr-only">Sign in with Google</span>
            <Image
              className="mx-auto h-12 w-auto"
              src="/btn_google_signin_dark_normal_web.png"
              alt=""
              height={43.24}
              width={200}
            />
          </button>
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => signIn("apple")}
          >
            <span className="sr-only">Sign in with Apple</span>
            <Image
              className="mx-auto h-12 w-auto"
              src="/appleid_button.png"
              alt=""
              height={43.24}
              width={200}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
