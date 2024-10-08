const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const fileID = process.env.OPENAI_FILE_ID;
const assistantID = process.env.OPENAI_ASSISTANT_ID;


async function createThread() {
  const myThread = await openai.beta.threads.create();
  return myThread;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function postProcessResponse(response) {
  return response.replace(/For more detailed information, you can refer to the file .*?\./gi, '');
}
async function retrieveRun(threadId, runId) {
  while (true) {
    const keepRetrievingRun = await openai.beta.threads.runs.retrieve(
      threadId,
      runId
    );

    if (keepRetrievingRun.status === 'completed') {
      const allMessages = await openai.beta.threads.messages.list(threadId);
      return allMessages.data[0].content[0].text.value;
    } else if (
      keepRetrievingRun.status === 'queued' ||
      keepRetrievingRun.status === 'in_progress'
    ) {
      await sleep(5000);
    } else {
      break;
    }
  }
  return null;
}



app.post('/ask', async (req, res) => {
  const userInput = req.body.prompt;

  if (!userInput) {
    return res.status(400).send({ error: 'Prompt is required' });
  }

  try {
    const myThread = await createThread();

    const myThreadMessage = await openai.beta.threads.messages.create(
      myThread.id,
      {
        role: 'user',
        content: userInput,
      }
    );

    const myRun = await openai.beta.threads.runs.create(myThread.id, {
      assistant_id: assistantID,
      instructions: "Answer the user's question directly and concisely. Do not reference any files, documents, or sources. Provide information based solely on the content provided in the user input.",
    });

    await sleep(15000);

    let response = await retrieveRun(myThread.id, myRun.id);

    if (response) {
      response = postProcessResponse(response);
      res.send({ response });
    } else {
      res.status(500).send({ error: 'Failed to retrieve response' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
