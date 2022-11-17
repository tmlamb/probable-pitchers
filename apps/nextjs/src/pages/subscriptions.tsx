import { authOptions } from "@probable/api/src/auth";
import { subscriptionSchedule } from "@probable/common/src";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";

const Subscriptions: NextPage = () => {
  const { data: session } = useSession();

  const { data: subscriptions } = trpc.subscription.byUserId.useQuery(
    undefined,
    {
      enabled: !!session,
    }
  );

  const schedule = subscriptionSchedule(subscriptions);

  if (session) {
    return (
      <Layout>
        <main className="container flex flex-col items-start justify-center min-h-screen space-y-4 max-w-5xl p-4 mx-auto">
          <h1 className="text-5xl leading-normal font-extrabold text-gray-700">
            Subscriptions
          </h1>
          {Object.entries(schedule).map(([nextGameDay, subscriptions]) => (
            <div key={nextGameDay}>
              <h2 className="text-2xl leading-normal font-extrabold text-gray-700">
                {subscriptions.nextGameDay}
              </h2>
              {subscriptions.data.map((subscription) => (
                <div key={subscription.id}>{subscription.pitcher.name}</div>
              ))}
            </div>
          ))}
        </main>
      </Layout>
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
        destination: "/?showSignInModal=true&callbackUrl=/subscriptions",
        permanent: false,
      },
    };
  }
  return {
    props: { session: { ...session, user: { ...session.user, name: null } } },
  };
};

export default Subscriptions;
