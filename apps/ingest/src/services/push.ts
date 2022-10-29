import fetch from "node-fetch";

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: object
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };
  try {
    console.log(`sending push notification: ${JSON.stringify(message)}`);
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error(error);
  }
}
