/**
 * Generates a random numeric room ID of the specified length.
 * 
 * @param length - The length of the room ID to generate. Default is 6.
 * @returns A string representing the generated room ID.
 */
const generateRoomId = (length: number = 6): string => {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export default generateRoomId;
