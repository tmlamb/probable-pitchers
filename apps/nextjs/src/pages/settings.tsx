import { authOptions } from "@probable/api/src/auth";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";

const Settings: NextPage = () => {
  const { data: session } = useSession();
  const { data: settings } = trpc.user.settings.useQuery(undefined, {
    enabled: !!session,
  });
  console.log(settings);

  if (session) {
    return (
      <>
        <Layout>
          <main className="container flex flex-col items-start justify-center min-h-screen space-y-4 max-w-5xl p-4 mx-auto">
            <h1 className="text-5xl leading-normal font-extrabold text-gray-700">
              Settings
            </h1>
            <div className="flex flex-row items-baseline justify-start">
              <span className="text-2xl leading-normal font-extrabold mr-3 text-gray-700">
                Notifications Enabled:
              </span>
              <span className="text-2xl">
                {String(settings?.notificationsEnabled)}
              </span>
            </div>
          </main>
        </Layout>
      </>
    );
  }
  return <p>Access Denied</p>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await unstable_getServerSession(
    context?.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/?showSignInModal=true&callbackUrl=/settings",
        permanent: false,
      },
    };
  }
  return {
    props: { session: { ...session, user: { ...session.user, name: null } } },
  };
};

export default Settings;
