import { BugAntIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import LinkButton from "../components/LinkButton";

const Support: NextPage = () => {
  return (
    <main className="container flex flex-col items-start justify-center min-h-screen space-y-4 max-w-5xl p-4 mx-auto">
      <h1 className="text-5xl leading-normal font-extrabold text-gray-700">
        Support
      </h1>
      <p>
        Thank you for using Probable Pitcher! This service is developed as an
        open source project on the GitHub platform. If you have any questions or
        need help, please reach out over GitHub:
      </p>
      <LinkButton href="https://github.com/tmlamb/probable-pitchers/issues/new">
        <BugAntIcon className="h-6 w-6 mr-2 inline" aria-hidden="true" />
        Report Issue On Github
      </LinkButton>
      <h3 className="pt-4 text-2xl">FAQs</h3>
      <p className="font-bold">How does the Probable Pitcher service work?</p>
      <p>
        Our service monitors MLB&apos;s official API for game data. We then use
        that data to determine the probable pitcher for each game, and send you
        a mobile push notification if you are subscribed to that pitcher.
      </p>
      <p className="font-bold">What types of notifications will I receive?</p>
      <p>
        You will receive one notification in the morning if one or more pitchers
        you are subscribed to pitch that day. You may receive additional
        notifications throughout the day if there are schedule updates that add
        a pitcher you are subscribed to.
      </p>
      <p className="font-bold">Why am I not receiving notifications?</p>
      <p>
        Check your application settings and make sure notifications are enabled.
        Our service makes a best effort to send you notifications, but we cannot
        guarantee that you will receive them.
      </p>
      <h3 className="pt-4 text-2xl">Contact Us</h3>
      <p>
        The fastest way to receive support is to open an issue on our GitHub
        page linked above. If you want to contact us directly, you can email us
        here:
        <span className="block pt-2 text-sm">contact@probablepitcher.com</span>
      </p>
    </main>
  );
};

export default Support;
