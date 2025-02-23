// RECEIVE =================================================================
// TODO(kkiyama117): Utils for input data

// SEND ======================================================================
export const sendReport = async (
  device: HIDDevice,
  reportId: number,
  sendData: ArrayBuffer | ArrayBufferView,
  filter?: (
    reportId: number,
    sendData: ArrayBuffer | ArrayBufferView
  ) => boolean
): Promise<void> => {
  if (filter) {
    if (filter(reportId, sendData)) {
      await device.sendReport(reportId, sendData);
    }
  } else {
    await device.sendReport(reportId, sendData);
  }
};
