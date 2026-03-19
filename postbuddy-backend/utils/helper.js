export const generateIDs = () => {
  const timestamp = Date.now().toString();
  let randomDigits = "";
  for (let i = 0; i < 8; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }
  return `O-${timestamp.slice(-6)}${randomDigits}`;
};

export const generateInviteLink = (organizationId, email) => {
  return `${process.env.FRONTEND_URL}/join/${organizationId}?email=${email}`;
};
