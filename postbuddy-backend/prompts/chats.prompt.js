export const chatsPrompt = (data, brandVoiceSummary = "") => {
  const baseRequirements = {
    whatsapp: `${brandVoiceSummary ? `${brandVoiceSummary}\n` : ''}
    You are crafting a WhatsApp message as ${data.myName || 'me'}. 
    Chat context: ${JSON.stringify(data.chats)}
    
    ${data.message 
      ? `Rephrase this message naturally: "${data.message}"` 
      : `Generate a response based on recent messages`}
    
    Key Analysis:
    1. Language detection (English/Hindi/Hinglish)
    2. Tone matching (casual/conversational)
    3. Style adaptation (abbreviations, length)
    4. Speaker identification ("By me" patterns)
    
    Requirements:
    - Mirror the EXACT language mix found in chat history
    - Match the casual WhatsApp style:
      * Short messages (1-2 lines max)
      * Natural abbreviations
      * Conversational flow
    - Use Hinglish if chat uses Hinglish
    - No formal language or business tone
    - Include common WhatsApp expressions
    - Maintain "By me" speaking style
    
    ${data.message ? '' : '- Continue conversation naturally'}`,

    linkedin: `${brandVoiceSummary ? `${brandVoiceSummary}\n` : ''}
    You are writing a LinkedIn ${data.message ? 'reply' : 'message'} as ${data.myName}
    Chat context: ${JSON.stringify(data.chats)}
    
    ${data.message 
      ? `Rephrase professionally: "${data.message}"` 
      : `Compose an appropriate ${data.chats ? 'response' : 'first message'}`}
    
    Key Analysis:
    1. Language detection (English/Hindi)
    2. Professional tone level
    3. Conversation flow
    
    Requirements:
    - Match the language of recent messages
    - Professional but conversational
    - 1-2 concise sentences
    - No greetings/closings
    - Straight to the point
    - No emojis/excessive punctuation
    ${data.message ? '- Must rephrase, not repeat verbatim' : ''}
    
    Examples:
    - "5 months experience" → "I've been in this role for 5 months"
    - "Java needed" → "We're looking for Java developers"`,

    translate: `Translate this text to ${data.language}:
    "${data.text}"
    
    Requirements:
    - Preserve original meaning
    - Maintain tone
    - Natural sounding translation
    - No additional commentary`,

    grammar: `Correct the grammar of:
    "${data.text}"
    
    Requirements:
    - Fix errors only
    - Preserve meaning and tone
    - No explanations
    - No quote wrapping
    - Output clean text only`
  };

  let prompt;
  if (data.type === "translate") {
    prompt = baseRequirements.translate;
  } else if (data.type === "grammar") {
    prompt = baseRequirements.grammar;
  } else {
    prompt = data.platform === "whatsapp" 
      ? baseRequirements.whatsapp 
      : baseRequirements.linkedin;
  }

  const messageArray = [
    {
      role: "system",
      content: prompt
    },
    {
      role: "system",
      content: "CRITICAL: Match the EXACT language style (English/Hindi/Hinglish) used in recent messages. Default to English if no history exists."
    },
    {
      role: "system",
      content: 'If content violates policies, respond: "This cannot be generated."'
    }
  ];

  return { 
    messageArray, 
    prompt: typeof prompt === "string" ? prompt : JSON.stringify(prompt) 
  };
};

export const recreatePostPrompt = (data, brandVoiceSummary = "") => {
  const prompt = `
  ${brandVoiceSummary ? `${brandVoiceSummary}\n` : ''}
  Transform this ${data.platform} post for maximum engagement:
  Original: "${data.text}"
  
  Requirements:
  - Keep core message but enhance presentation
  - Add viral potential elements:
    * Strong hook
    * Clear structure
    * Emotional resonance
  - Include 2-3 relevant emojis
  - Add professional CTA
  - Maintain platform norms
  - No placeholder text
  - Improved readability
  
  Output must:
  - Sound like fresh original content
  - Be share-worthy
  - Reflect brand voice
  - Use proper formatting`;

  const messageArray = [
    {
      role: "system",
      content: prompt
    },
    {
      role: "system",
      content: "Don't paraphrase - creatively reimagine the content while preserving the core message."
    },
    {
      role: "system",
      content: 'Reject illegal requests with: "Cannot process this request."'
    }
  ];

  return { messageArray, prompt };
};