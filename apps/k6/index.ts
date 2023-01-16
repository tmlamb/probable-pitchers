import http from "k6/http";

export const options = {
  vus: 5,
  duration: "60s",
};

const names = [
  '"Taylor"',
  '"Michael"',
  '"Matthew"',
  '"Christopher"',
  '"Andrew"',
  '"Jacob"',
  '"Tyler"',
  '"Austin"',
  '"Zack"',
  '"Ryan"',
  '"David"',
  '"Thomas"',
  '"John"',
  '"Park"',
  '"Kyle"',
  '"Aaron"',
];

export default function () {
  const searchTerms = [names[Math.floor(Math.random() * names.length)]];
  if (Math.random() > 0.5) {
    searchTerms.push(names[Math.floor(Math.random() * names.length)]);
  }

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    cookies: {
      "__Secure-next-auth.session-token":
        "",
      "__Host-next-auth.csrf-token":
        "",
      "__Secure-next-auth.callback-url":
        "https%3A%2F%2Fdev.probablepitcher.com",
    },
  };
  // console.log(
  //   `https://dev.probablepitcher.com/api/trpc/pitcher.byNameSearch?batch=1&input={"0":{"json":[${searchTerms.join(
  //     ","
  //   )}]}}`
  // );
  http.get(
    `https://dev.probablepitcher.com/api/trpc/pitcher.byNameSearch?batch=1&input={"0":{"json":[${searchTerms.join(
      ","
    )}]}}`,
    params
  );
}

// `https://dev.probablepitcher.com/api/trpc/pitcher.byNameSearch?batch=1&input={"0":{"json":["Clayton","Kershaw"]}}`,
