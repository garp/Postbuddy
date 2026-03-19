export const brandVoiceSummaryPrompt = (data) => {
  let prompt = `
  Create a powerful and concise brand voice summary for the following individual or brand. Your output should sound polished and ready for professional branding use — ideal for LinkedIn post comments, personal websites, or investor decks and DM replies.

Craft the summary in 5 to 6 well-structured sentences and include the following:
- Clear tone of voice and communication style
- Personality traits that influence how they speak and write
- Primary target audience or who they are trying to attract
- Core services, domain expertise, or standout skills
- Unique value proposition or what sets them apart in the industry
- A compelling insight into their personal or professional journey
- A strong, purpose-driven mission statement

Write with clarity and energy. Avoid fluff. Focus on *what makes this brand voice distinct, memorable, and relatable*.

Use this input:

Name: ${data.name}  
Industry: ${data.industry}  
Tone of Voice: ${data.toneOfVoice}  
Personality: ${data.personality}  
Target Audience: ${data.targetAudience}  
Service/Skills: ${data.serviceSkills}  
Unique Strengths: ${data.uniqueStrengths}  
Personal Background: ${data.personalBackground}  
Professional Experience: ${data.professionalExperience}  
Personal Mission: ${data.personalMission}
`;

  const messageArray = [
    {
      role: "system",
      content: prompt,
    },
    {
      role: "system",
      content: `Do not wrap the comment in the Quotes or double quotes add only thing`,
    },
    {
      role: "system",
      content:
        'If the user prompt contains illegal activity according to law, do not display it and respond with "try again later."',
    },
  ];

  return { messageArray, prompt };
};
