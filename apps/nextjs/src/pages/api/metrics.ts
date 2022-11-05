import { NextApiResponse } from "next";
import { collectDefaultMetrics, register } from "prom-client";

collectDefaultMetrics({});

const metrics = async (_: never, res: NextApiResponse) => {
  res.setHeader("Content-type", register.contentType);
  res.send(await register.metrics());
};

export default metrics;
