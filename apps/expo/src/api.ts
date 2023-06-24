import Constants from "expo-constants";

const { apiBaseUrl } = Constants.expoConfig?.extra || {};

export const getBaseUrl = () => {
  if (apiBaseUrl) {
    return apiBaseUrl;
  }

  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   */
  const localhost =
    Constants.manifest2?.extra?.expoGo?.debuggerHost?.split(":")[0];
  if (!localhost)
    throw new Error("failed to get localhost, configure it manually");
  return `http://${localhost}:3000`;
};
