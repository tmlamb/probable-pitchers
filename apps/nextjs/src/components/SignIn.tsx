import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center justify-between">
        <div className="bg-[#789d7c] h-[150px] w-[150px] p-4 rounded-md">
          <Image className="" src="/logo.png" alt="" height={150} width={150} />
        </div>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight ">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 flex flex-col">
          <button
            type="button"
            className="mb-4 active:opacity-25"
            onClick={() =>
              signIn("google", {
                callbackUrl:
                  router.query.callbackUrl &&
                  typeof router.query.callbackUrl === "string"
                    ? router.query.callbackUrl
                    : "/",
              })
            }
          >
            <span className="sr-only">Sign in with Google</span>
            <Image
              className="mx-auto w-auto"
              src="/btn_google_signin_dark_normal_web.png"
              alt=""
              height={43.24}
              width={200}
            />
          </button>
          <button
            type="button"
            className="active:opacity-25"
            onClick={() =>
              signIn("apple", {
                callbackUrl:
                  router.query.callbackUrl &&
                  typeof router.query.callbackUrl === "string"
                    ? router.query.callbackUrl
                    : "/",
              })
            }
          >
            <span className="sr-only">Sign in with Apple</span>
            <Image
              className="mx-auto w-auto"
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
