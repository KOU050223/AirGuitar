// Get output subcommand without flag
import { DEFAULT_RUMBLE_DATA } from "./constants/rumble";
import { sendReport } from "../hid_common";
import { delay } from "../utils";

export const createSubCommandQuery = (
  packetNum: number,
  rumbleData: number[],
  subCommand: number,
  subCommandArguments: number[]
): ArrayBuffer | ArrayBufferView => {
  if (rumbleData.length !== 8) {
    throw new Error("Invalid rumble data");
  }
  const query = [
    // Increment by 1 for each packet sent. It loops in 0x0 - 0xF range.
    packetNum % 0x10,
    // Rumble ==================================================================
    // https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_notes.md#rumble-data
    ...rumbleData,
    // Sub Command =============================================================
    subCommand,
    ...subCommandArguments,
  ];
  return Uint8Array.from(query);
};

export const sendSubCommand = async (
  device: HIDDevice,
  packetNum: number,
  rumbles = DEFAULT_RUMBLE_DATA,
  subcommand: number,
  subcommandArgs: number[]
) => {
  await sendReport(
    device,
    0x01,
    createSubCommandQuery(packetNum, rumbles, subcommand, subcommandArgs)
  );
  await delay(500);
};
