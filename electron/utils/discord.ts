import { Client, type SetActivity } from "@kostya-main/discord-rpc";
import { logger } from "./logger";

const dateElapsed = Date.now();

const clientId = "1461691220454543484";
const client = new Client({ clientId });

let rpcActivity: SetActivity = {
  startTimestamp: dateElapsed,
  details: "Choosing Version",
  largeImageKey: "butterlauncher",
  largeImageText: "Butter Launcher",
  buttons: [
    {
      label: "Play Free Hytale",
      url: "https://butterlauncher.tech",
    },
  ],
};

export const setChoosingVersionActivity = () => {
  setActivity({
    startTimestamp: dateElapsed,
    details: "Choosing Version",
    state: undefined,
    // No small image while in launcher UI.
    smallImageKey: undefined,
    smallImageText: undefined,
  });
};

export const setPlayingActivity = (version: GameVersion) => {
  const build =
    version.build_name || `Build-${version.build_index} ${version.type}`;
  setActivity({
    startTimestamp: Date.now(),
    details: "Playing Hytale No-Premium",
    state: build,
    // Show small bubble with Hytale icon while playing.
    smallImageKey: "hytale",
    smallImageText: "Hytale",
  });
};

export const setActivity = (activity?: SetActivity) => {
  rpcActivity = {
    ...rpcActivity,
    ...activity,
  };

  client.user?.setActivity(rpcActivity).catch((err: any) => {
    logger.error("Discord RPC error:", err);
  });
};

export const connectRPC = async () => {
  client
    .login()
    .then(() => {
      logger.info("Discord RPC connected");
      setChoosingVersionActivity();
    })
    .catch((err: any) => {
      logger.error("Discord RPC error:", err);
    });
};

export const clearActivity = async () => {
  logger.info("Clearing Discord RPC activity");

  try {
    await client.user?.clearActivity();
  } catch (err: any) {
    logger.error("An error occurred while clearing Discord RPC activity", err);
  }
};

export const disconnectRPC = async () => {
  logger.info("Disconnecting Discord RPC");
  await clearActivity();

  // Destroy/close the IPC connection to Discord so presence doesn't linger.
  try {
    (client as any).destroy?.();
  } catch (err: any) {
    logger.error("An error occurred while disconnecting Discord RPC", err);
  }
};

// on RPC is ready
client.on("ready", () => {
  setChoosingVersionActivity();
});
