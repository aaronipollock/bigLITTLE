import Constants from "expo-constants";

// `localhost` means different things depending on where the app runs.
// On the iOS simulator it is the Mac, so localhost works. On a physical
// phone it is the phone itself, so localhost points nowhere. On the Android
// emulator the host machine is 10.0.2.2.
//
// In development the Expo dev server tells us the host it is being served
// from (e.g. "192.168.1.5:8081"), which is the machine running the API.
// Reuse that host with the API's port so a real device works without
// hardcoding an address that changes with the network.
const devHost = Constants.expoConfig?.hostUri?.split(":")[0];

export const API_URL = devHost
    ? `http://${devHost}:3000`
    : "http://localhost:3000";
