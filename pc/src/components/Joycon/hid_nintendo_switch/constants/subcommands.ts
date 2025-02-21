// SubCommands ===============================================================
// https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommands
// https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x-all-unused-subcommands

// https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x00-get-only-controller-state
export const sub_command_0x00 = () => [0x00];

// https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x01-bluetooth-manual-pairing
export const sub_command_0x01_1 = (bluetooth_address: number[]) => [
  0x01,
  0x01,
  ...bluetooth_address,
];

export const sub_command_0x01_2 = () => [0x01, 0x02];

export const sub_command_0x01_3 = () => [0x01, 0x03];

// https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x02-request-device-info
export const sub_command_0x02 = () => [0x02];

// https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x03-set-input-report-mode
export const sub_command_0x03 = (mode: number) => [0x03, mode];
