export const createBotPrompts = (data) => {
  console.log("Data ==> ", data)
  let prompt = "";

  switch (data.request) {
    case "predict virality score":
      prompt = `As a LinkedIn content optimization expert, analyze the viral potential of this post. Consider these key factors:
      - Engagement potential (likes, comments, shares)
      - Professional relevance
      - Emotional resonance
      - Call-to-action effectiveness
      - Hashtag usage
      - Visual appeal (if any)
      - Timing and relevance
      
      Post content: "${data.text}"
      
      Provide a rating from 1-10, where:
      1-3: Low viral potential
      4-6: Moderate viral potential
      7-10: High viral potential
      
      Give your rating as a single number without any explanation.`;
      break;

    case "summarize the text":
      prompt = `Summarize the following text clearly and concisely:\n\n"${data.text}"`;
      break;

    case "rephrase this text":
      prompt = `Rephrase the following text to improve readability and clarity:\n\n"${data.text}"`;
      break;

    default:
      prompt = `Perform the requested operation on the following text:\n\n"${data.text}"`;
      break;
  }

  const messageArray = [
    {
      role: "system",
      content: prompt,
    },
    {
      role: "system",
      content:
        'If the user prompt contains illegal activity according to law, do not display it and respond with "try again later."',
    },
  ];

  return { messageArray, prompt };
};
