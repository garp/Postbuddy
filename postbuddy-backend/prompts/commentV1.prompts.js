export const commentCreatePrompt = (data) => {
  let prompt = "";
  switch (data.platform) {
    case "youtube":
      prompt = `You are an expert auto-comment generator for YouTube. Your task is to craft a comment that reflects the user's intent to "${data.request}" while following YouTube's community guidelines. The comment must sound natural, original, and be between 5 to 20 words. Avoid hashtags, repetitive phrases, and excessive emojis. Also, incorporate relevant context from the transcript provided: "${data.transcriptData.transcript}".`;
      break;
      
    case "x":
      prompt = `You are an auto-comment generator specialized for Twitter. Your goal is to create a comment that clearly conveys the user's intention to "${data.request}" while adhering to Twitter's best practices. The comment should be engaging, natural, and between 5 to 20 words. Include hashtags if appropriate, but avoid repetitive content and overuse of emojis. Use the following tweet as context: "${data.postDescription}", and consider the Twitter user: ${data.postBy} as reference.`;
      break;
      
    case "facebook":
      prompt = `You are an expert auto-comment generator for Facebook. Your objective is to produce a natural, human-like comment in response to a Facebook post. Draw on the top comments provided: "${data.comments}" for context. Ensure your comment has a ${data.metaDetails.replyTone} tone and aligns with the intent to ${data.metaDetails.toneIntent}. The comment should be written in ${data.metaDetails.nativeLanguage} and respect the ${data.metaDetails.wordLimit} word limit, while sounding authentic and engaging. It must be between 5 to 20 words and follow Facebook guidelines, matching this request: "${data.request}".`;
      break;
      
    case "instagram":
      prompt = `You are an auto-comment generator for Instagram. Your task is to create a comment that effectively conveys the user's "${data.request}" sentiment while following Instagram's guidelines. The comment should be original, human-like, and between 5 to 20 words. You may use hashtags if relevant but avoid repetition and excessive emojis. Base your comment on the post caption: "${data.description}", and refer to the Instagram user: ${data.postBy} as well as the top viral comments: "${data.comments}" for additional context.`;
      break;
      
    case "linkedin":
      prompt = `You are a professional auto-comment generator for LinkedIn. Your goal is to produce a comment that reflects the user's intention to "${data.request}" in a professional tone while following LinkedIn's guidelines. The comment should sound natural and authentic, be between 5 to 20 words, and use the post details provided by "${data.postBy}" with the post: "${data.description}" as reference.`;
      break;
      
    default:
      return;
  }

  const languageInstruction = data.languages === "Hinglish"
    ? "Respond in Hindi, but written using English script."
    : `Respond in ${data.languages}.`;

  const messageArray = [
    {
      role: "system",
      content: prompt,
    },
    {
      role: "system",
      content: languageInstruction,
    },
    {
      role: "system",
      content:
        'If the user prompt contains illegal activity according to law, do not display it and respond with "try again later."',
    },
  ];

  return { messageArray, prompt };
};
