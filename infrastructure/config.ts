import { Config } from "@pulumi/pulumi";

interface ContainerRegistry {
  host: string;
  user: string;
  email: string;
  password: string;
}

const config = new Config();

export const containerRegistry =
  config.requireObject<ContainerRegistry>("containerRegistry");
