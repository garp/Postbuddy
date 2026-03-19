import * as HttpService from './httpServices.js';
import { CHAT_GPT } from '../config/ai.js';
import { logError } from './logger.js';

const URL = CHAT_GPT.URL;
const MODEL = CHAT_GPT.MODEL;
const TEMPERATURE = CHAT_GPT.TEMPERATURE;

/**
 * Function to interact with ChatGPT API
 * @param {Array} messageArray - Array of messages to send to ChatGPT
 * @param {string} key - API key to use for the request
 * @returns {Promise<string>} - ChatGPT's response message
 */
export const chatGPT = async (messageArray, key) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${key}`, 
        'Content-Type': 'application/json',
      },
    };

    const { data } = await HttpService.axiosPost(
      URL,
      {
        model: MODEL,
        messages: messageArray,
        temperature: TEMPERATURE,
      },
      config
    );

    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      logError('Unexpected response from ChatGPT API');
      return 'No valid response from ChatGPT.';
    }

    // console.log('Received response from ChatGPT:', data.choices[0]);
    return data.choices[0].message.content;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log("Error: ", error);
    logError(`Error in ChatGPT Service: ${errorMessage}`);
    return 'Error occurred while generating response.';
  }
};
