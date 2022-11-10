import type { NextPage } from "next";
import Head from "next/head";

const Privacy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Probable Pitcher</title>
        <meta
          name="description"
          content="Get notified when your favorite pitchers are scheduled to pitch."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container flex flex-col items-start justify-center min-h-screen space-y-4 max-w-5xl p-4 mx-auto">
        <h1 className="text-5xl leading-normal font-extrabold text-gray-700">
          Privacy Policy
        </h1>
        <p>
          Probable Pitcher operates the iOS/Android mobile apps and
          probablepitcher.com website, which provide the SERVICE.
        </p>
        <p>
          This page is used to inform mobile app users and website visitors
          regarding our policies with the collection, use, and disclosure of
          Personal Information if anyone decided to use our Service, the
          Probable Pitcher website and mobile app.
        </p>
        <p>
          If you choose to use our Service, then you agree to the collection and
          use of information in relation with this policy. The Personal
          Information that we collect are used for providing and improving the
          Service. We will not use or share your information with anyone.
        </p>
        <h3 className="pt-4 text-2xl">Information Collection and Use</h3>
        <p>
          For a better experience while using our Service, we may require you to
          provide us with certain personally identifiable information, including
          your email address. The information that we collect will be used to
          contact or identify you.
        </p>
        <h3 className="pt-4 text-2xl">Log Data</h3>
        <p>
          We want to inform you that whenever you visit our Service, we collect
          information that your browser or device sends to us that is called Log
          Data. This Log Data may include information such as your
          computer&apos;s Internet Protocol (&dbquo;IP&dbquo;) address, browser
          version, pages of our Service that you visit, the time and date of
          your visit, the time spent on those pages, and other statistics.
        </p>
        <h3 className="pt-4 text-2xl">Cookies </h3>
        <p>
          Cookies are files with a small amount of data that is commonly used as
          an anonymous unique identifier. These are sent to your browser or
          device from the website or application service backend that you visit
          and are stored on your computer&apos;s hard drive.
        </p>
        <p>
          Our service uses these &dbquo;cookies&dbquo; to collect information
          and to improve our Service. You have the option to either accept or
          refuse these cookies, and know when a cookie is being sent to your
          computer. If you choose to refuse our cookies, you may not be able to
          use some portions of our Service.
        </p>
        <h3 className="pt-4 text-2xl">Service Providers</h3>
        <p>
          We may employ third-party companies and individuals due to the
          following reasons:
        </p>
        <ul className="ml-8 list-disc">
          <li>To facilitate our Service;</li>
          <li>To provide the Service on our behalf;</li>
          <li>To perform Service-related services; or</li>
          <li>To assist us in analyzing how our Service is used.</li>
        </ul>
        <p>
          We want to inform our Service users that these third parties have
          access to your Personal Information. The reason is to perform the
          tasks assigned to them on our behalf. However, they are obligated not
          to disclose or use the information for any other purpose.
        </p>
        <h3 className="pt-4 text-2xl">Security</h3>
        <p>
          We value your trust in providing us your Personal Information, thus we
          are striving to use commercially acceptable means of protecting it.
          But remember that no method of transmission over the internet, or
          method of electronic storage is 100% secure and reliable, and we
          cannot guarantee its absolute security.
        </p>
        <h3 className="pt-4 text-2xl">Links to Other Sites</h3>
        <p>
          Our Service may contain links to other sites. If you click on a
          third-party link, you will be directed to that site. Note that these
          external sites are not operated by us. Therefore, we strongly advise
          you to review the Privacy Policy of these websites. We have no control
          over, and assume no responsibility for the content, privacy policies,
          or practices of any third-party sites or services.{" "}
        </p>
        <h3 className="pt-4 text-2xl">Changes to This Privacy Policy</h3>
        <p>
          We may update our Privacy Policy from time to time. Thus, we advise
          you to review this page periodically for any changes. We will notify
          you of any changes by posting the new Privacy Policy on this page.
          These changes are effective immediately, after they are posted on this
          page.
        </p>
        <h3 className="pt-4 text-2xl">Contact Us</h3>
        <p>
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us.
        </p>
      </main>
    </>
  );
};

export default Privacy;
