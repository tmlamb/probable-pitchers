import { sleep } from "k6";
import http from "k6/http";

export const options = {
  vus: 10,
  duration: "30s",
};

export default function () {
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    cookies: {},
  };

  http.get(
    `https://probablepitcher.com/api/trpc/pitcher.byNameSearch?batch=1&input={"0":{"json":["Clayton","Kershaw"]}}`,
    params
  );
  sleep(1);
}
