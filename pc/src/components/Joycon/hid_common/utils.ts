export const dataViewToArray = (data: DataView) =>
  Array.from(new Uint8Array(data.buffer));
