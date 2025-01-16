export const dataURLToBlob = (dataURL: string) => {
  const parts = dataURL.split(",");
  const mimeType = parts[0].match(/:(.*?);/)?.[1];
  const byteString = atob(parts[1]);
  const arrayBuffer = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeType });
};
