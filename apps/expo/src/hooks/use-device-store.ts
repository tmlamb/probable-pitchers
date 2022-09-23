import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import create from "zustand";
import { persist } from "zustand/middleware";

// AsyncStorage.removeItem("device-storage");

export interface DeviceStore {
  deviceId: string;
  isFirstLaunch: boolean;
  setIsFirstLaunch: (isFirstLaunch: boolean) => void;
}

const useDeviceStore = create<DeviceStore>()(
  persist(
    (set) => ({
      deviceId: uuidv4(),
      isFirstLaunch: true,
      setIsFirstLaunch: (isFirstLaunch: boolean) => {
        set({ isFirstLaunch });
      },
    }),
    {
      name: "device-storage",
      getStorage: () => AsyncStorage,
    }
  )
);

export default useDeviceStore;
