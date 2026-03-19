export const createBotPrompts = (data) => {
  let prompt = "";

  switch (data.request) {
    case "predict virality score":
      prompt = `You are a social media analytics expert with deep knowledge about LinkedIn post performance. Analyze the following post and assign a virality rating on a scale of 1 to 10, where 1 indicates the lowest viral potential and 10 the highest. Provide only the numerical rating without any additional commentary.\n\nPost: "${data.text}"`;
      break;

    case "summarize the text":
      prompt = `You are an expert summarizer. Read the following text and provide a clear, concise summary that captures the key points in just a few sentences.\n\nText: "${data.text}"`;
      break;

    case "rephrase this text":
      prompt = `You are an expert in language and communication. Rephrase the following text to improve clarity, readability, and engagement while preserving its original meaning. Ensure that the rephrased version is smooth and professional.\n\nText: "${data.text}"`;
      break;

    default:
      prompt = `You are a helpful assistant. Perform the requested operation on the following text carefully and accurately.\n\nText: "${data.text}"`;
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
