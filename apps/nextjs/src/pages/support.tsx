import { BugAntIcon } from "@heroicons/react/24/outline";
import { faqs } from "@probable/common";
import type { NextPage } from "next";
import LinkButton from "../components/LinkButton";

const Support: NextPage = () => {
  return (
    <main className="container flex flex-col items-start justify-start min-h-screen space-y-4 max-w-7xl py-8 px-3 sm:px-8 mx-auto">
      <h1 className="text-3xl sm:text-5xl leading-normal font-extrabold text-gray-700">
        Support
      </h1>
      <div className="max-w-prose flex flex-col space-y-4">
        <p>
          Thank you for using Probable Pitcher! This service is developed as an
          open source project on the GitHub platform. If you have any questions
          or need help, please reach out over GitHub:
        </p>
        <LinkButton href="https://github.com/tmlamb/probable-pitchers/issues/new">
          <BugAntIcon className="h-6 w-6 mr-2 inline" aria-hidden="true" />
          Report Issue On Github
        </LinkButton>
        <h2 className="pt-4 text-2xl">FAQs</h2>
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="pt-2 font-bold">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
        <h2 className="pt-4 text-2xl">Contact Us</h2>
        <p>
          The fastest way to receive support is to open an issue on the GitHub
          page linked above. Emails are also welcome:
          <span className="block pt-2 text-sm">
            contact@probablepitcher.com
          </span>
        </p>
      </div>
    </main>
  );
};

export default Support;
