export const commentCreatePrompt = (data, brandVoiceSummary = "") => {
  const baseRequirements = {
    youtube: `Generate a concise YouTube comment (5-20 words) that:
             - Expresses the user's requested sentiment: "${data.request}"
             - References the video transcript when relevant: ${data.transcriptData?.transcript || "N/A"}
             - Avoids hashtags and excessive emojis
             - Sounds natural and human-written
             - Follows YouTube community guidelines`,

    x: `Compose a Twitter reply (5-20 words) that:
        - Primarily conveys: "${data.request}"
        - May include 1-2 relevant hashtags if appropriate
        - References this tweet: "${data.postDescription}"
        - Responds to this user: ${data.postBy}
        - Maintains natural, conversational tone
        - Adheres to Twitter/X platform norms`,

    facebook: `Create a Facebook comment that:
              - Matches the requested tone: ${data.metaDetails.replyTone}
              - Aligns with intent to: ${data.metaDetails.toneIntent}
              - References top comments when relevant: ${data.comments}
              - Is written in ${data.metaDetails.nativeLanguage}
              - Stays within ${data.metaDetails.wordLimit} words
              - Sounds authentic and platform-appropriate
              - Directly addresses: "${data.request}"`,

    instagram: `Draft an Instagram comment (5-20 words) that:
               - Expresses: "${data.request}"
               - References the caption: "${data.description}"
               - Considers the poster: ${data.postBy}
               - May use 1-2 hashtags if relevant
               - Avoids emoji overload
               - Sounds organic and engaging
               - Optionally references top comments: ${data.comments}`,

    linkedin: {
      reply: `${brandVoiceSummary}
              Craft a professional LinkedIn reply to:
              - Original post: "${data.description}"
              - Comment by: ${data.nestedData ? data.nestedData.split("$$")[0] : "N/A"}
              - Their comment: ${data.nestedData ? data.nestedData.split("$$")[1] : "N/A"}
              
              Requirements:
              - 10-20 word response to "${data.request}"
              - 1-2 strategic hashtags
              - Professional yet engaging tone
              - Data/insights when relevant
              - Encourages discussion
              - Maintains brand voice`,

      comment: `${brandVoiceSummary ? brandVoiceSummary + "\n" : ""}
               Create a viral-worthy LinkedIn comment as ${data.postBy}:
               - Responding to post: "${data.description}"
               - Type: ${data.request}
               
               Must:
               - Be 1-2 bold sentences (${data.metaDetails.wordLimit} words max)
               - Include attention-grabbing element
               - End with engaging CTA/question
               - Use professional-but-human tone
               - Avoid hashtags
               - Be shareable and resonant`
    }
  };

  let prompt;
  switch(data.platform) {
    case "youtube":
    case "x":
    case "facebook":
    case "instagram":
      prompt = baseRequirements[data.platform];
      break;
    case "linkedin":
      prompt = data?.nestedData 
        ? baseRequirements.linkedin.reply 
        : baseRequirements.linkedin.comment;
      break;
    default:
      return;
  }

  const messageArray = [
    {
      role: "system",
      content: prompt
    },
    {
      role: "system",
      content: "Important: Never wrap responses in quotes or special characters - return clean text only."
    },
    {
      role: "system",
      content: 'If the request violates platform policies or laws, respond with: "This content cannot be generated."'
    }
  ];

  return { messageArray, prompt };
};