export const faqs = [
  {
    question: "How does the Probable Pitcher service work?",
    answer:
      "Our service monitors MLB's official API for game data. We then use that data to determine the probable pitcher for each game, and send you a mobile push notification if you are subscribed to that pitcher.",
  },
  {
    question: "What types of notifications will I receive?",
    answer:
      "You will receive one notification in the morning if one or more pitchers you are subscribed to pitch that day. You may receive additional notifications throughout the day if there are schedule updates that add a pitcher you are subscribed to.",
  },
  {
    question: "Why am I not receiving notifications?",
    answer:
      "Check your application settings and make sure notifications are enabled. Our service makes a best effort to send you notifications, but we cannot guarantee that you will receive them.",
  },
  {
    question: "My subscriptions are gone, where are they?",
    answer:
      "Subscriptions are tied to the account linked with your identity manager, like Google or Apple. So for instance, if you logged in previously with your Google account and added subscriptions, then later accessed the service with your Apple account, your Google account's subscriptions will not be available.",
  },
];