export const convertToBase64 = (file: File | string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof file === "string") return resolve(file);

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
