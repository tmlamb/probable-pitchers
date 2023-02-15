import http from "k6/http";
import { check } from 'k6';

export const options = {
  vus: 5,
  duration: "60s",
};

const names = [
  "Ohtani",
  "Michael",
  "Matthew",
  "Christopher",
  "Rodriguez",
  "Jacob",
  "Tyler",
  "Austin",
  "Zack",
  "Ryan",
  "David",
  "Contreras",
  "John",
  "Park",
  "Martínez",
  "Aaron",
];

const params = {
  headers: {
    "Content-Type": "application/json",
  },
  cookies: {
    "next-auth.session-token":
      "4c2358f5-51e0-4be5-ae8e-312a6b9888e8",
  },
};

export default function() {

  const searchTerms = [names[Math.floor(Math.random() * names.length)]];

  if (Math.random() > 0.5) {
    searchTerms.push(names[Math.floor(Math.random() * names.length)]);
  }
  const response = http.get(
    `${__ENV.API_URL}/api/trpc/pitcher.byFuzzyName?batch=1&input={"0":{"json":"${searchTerms.join("%20")}"}}`,
    params
  );

  check(response, {
    'Get status is 200': (r) => r.status === 200,
  });


}

