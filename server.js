// // const express = require('express');
// // const axios = require('axios');
// // const bodyParser = require('body-parser');
// // const cors = require('cors');
// // require('dotenv').config();

// // const app = express();
// // const port = process.env.PORT || 5001;

// // const corsOptions = {
// //     origin: 'http://localhost:3000',
// //     optionsSuccessStatus: 200
// //   };

// // app.use(cors());
// // app.use(bodyParser.json());

// // app.post('/api/gpt', async (req, res) => {
// //   const { query } = req.body;

// //   try {
// //     // Replace with your custom GPT API endpoint
// //     const response = await axios.post('https://chatgpt.com/g/g-9svzNm6HV-dhiraj-custom-gpt', {
// //       prompt: query,
// //     });

// //     res.json({ text: response.data.text });
// //   } catch (error) {
// //     console.error('Error fetching data:', error);
// //     res.status(500).json({ error: 'Error fetching data' });
// //   }
// // });

// // app.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// // });

// const express = require('express');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5001;

// // Configure CORS to allow requests from your frontend
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// app.post('/api/gpt', async (req, res) => {
//   const { query } = req.body;

//   try {
//     // Log the request payload for debugging
//     console.log('Request payload:', { prompt: query });

//     // Replace with your custom GPT API endpoint
//     const response = await axios.post(process.env.CUSTOM_GPT_API_ENDPOINT, {
//       prompt: query,
//     });

//     // Log the response from the custom GPT API
//     console.log('Response from GPT API:', response.data);

//     res.json({ text: response.data.text });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Error fetching data' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "sk-proj-SpbtT9em5CJqmAEjVp3nT3BlbkFJfwsXTLhmmouOYLrQjGlk",
});

async function main() {
  // Skip Step 1: Upload a File with an "assistants" purpose
  // Assume that you already have the file ID of the uploaded file
  const existingFileId = ("Dhiraj-Deepak_Frontend-SM-7YOE.pdf"); // Replace with your actual file ID

  // Step 2: Create an Assistant
  const myAssistant = await openai.beta.assistants.create({
    model: "gpt-3.5-turbo-1106",
    instructions:
      "This GPT provides precise answers to questions about Dhiraj Deepak's academic background, work experience, and technology stack. It strictly uses the information provided in the uploaded data file (file-x8ws5K08r40V2YHQYj3PNejo), ensuring responses are exact and without additional details. The GPT maintains a professional tone and adheres closely to the data provided, without elaborating beyond the information given.",
    name: "Customer Support Chatbot",
    tools: [{ type: "file_search" }],
  });
  console.log("This is the assistant object: ", myAssistant, "\n");

  // Step 3: Create a Thread
  const myThread = await openai.beta.threads.create();
  console.log("This is the thread object: ", myThread, "\n");

  // Step 4: Add a Message to a Thread
  const myThreadMessage = await openai.beta.threads.messages.create(
    (thread_id = myThread.id),
    {
      role: "user",
      content: "What is Dhirajs Experience in React",
      // Remove file_ids parameter
    }
  );
  console.log("This is the message object: ", myThreadMessage, "\n");

  // Step 5: Run the Assistant
  const myRun = await openai.beta.threads.runs.create(
    (thread_id = myThread.id),
    {
      assistant_id: myAssistant.id,
      instructions: "Please address the user as Rok Benko.",
    }
  );
  console.log("This is the run object: ", myRun, "\n");

  // Step 6: Periodically retrieve the Run to check on its status to see if it has moved to completed
  const retrieveRun = async () => {
    let keepRetrievingRun;

    while (myRun.status === "queued" || myRun.status === "in_progress") {
      keepRetrievingRun = await openai.beta.threads.runs.retrieve(
        (thread_id = myThread.id),
        (run_id = myRun.id)
      );
      console.log(`Run status: ${keepRetrievingRun.status}`);

      if (keepRetrievingRun.status === "completed") {
        console.log("\n");

        // Step 7: Retrieve the Messages added by the Assistant to the Thread
        const allMessages = await openai.beta.threads.messages.list(
          (thread_id = myThread.id)
        );

        console.log(
          "------------------------------------------------------------ \n"
        );

        console.log("User: ", myThreadMessage.content);
        console.log("Assistant: ", allMessages.data[0].content);

        break;
      } else if (
        keepRetrievingRun.status === "queued" ||
        keepRetrievingRun.status === "in_progress"
      ) {
        // pass
      } else {
        console.log(`Run status: ${keepRetrievingRun.status}`);
        break;
      }
    }
  };
  retrieveRun();
}

main();



// const OpenAI = require("openai");
// const openai = new OpenAI({
//   apiKey: "sk-proj-SpbtT9em5CJqmAEjVp3nT3BlbkFJfwsXTLhmmouOYLrQjGlk",
// });

// async function main() {
//   // Skip Step 1: Upload a File with an "assistants" purpose
//   // Assume that you already have the file ID of the uploaded file
//   const existingFileId = "file-li6d3wGjn0wcMW64LJ5hawNA"; // Replace with your actual file ID

//   // Step 2: Create an Assistant
//   const myAssistant = await openai.beta.assistants.create({
//     model: "gpt-3.5-turbo-1106",
//     instructions:
//       "You are a customer support chatbot. Use your knowledge base to best respond to customer queries.",
//     name: "Customer Support Chatbot",
//     tools: [{ type: "retrieval" }],
//   });
//   console.log("This is the assistant object: ", myAssistant, "\n");

//   // Step 3: Create a Thread
//   const myThread = await openai.beta.threads.create();
//   console.log("This is the thread object: ", myThread, "\n");

//   // Step 4: Add a Message to a Thread
//   const myThreadMessage = await openai.beta.threads.messages.create(
//     (thread_id = myThread.id),
//     {
//       role: "user",
//       content: "What can I buy in your online store?",
//       file_ids: [existingFileId],
//     }
//   );
//   console.log("This is the message object: ", myThreadMessage, "\n");

//   // Step 5: Run the Assistant
//   const myRun = await openai.beta.threads.runs.create(
//     (thread_id = myThread.id),
//     {
//       assistant_id: myAssistant.id,
//       instructions: "Please address the user as Rok Benko.",
//     }
//   );
//   console.log("This is the run object: ", myRun, "\n");

//   // Step 6: Periodically retrieve the Run to check on its status to see if it has moved to completed
//   const retrieveRun = async () => {
//     let keepRetrievingRun;

//     while (myRun.status === "queued" || myRun.status === "in_progress") {
//       keepRetrievingRun = await openai.beta.threads.runs.retrieve(
//         (thread_id = myThread.id),
//         (run_id = myRun.id)
//       );
//       console.log(`Run status: ${keepRetrievingRun.status}`);

//       if (keepRetrievingRun.status === "completed") {
//         console.log("\n");

//         // Step 7: Retrieve the Messages added by the Assistant to the Thread
//         const allMessages = await openai.beta.threads.messages.list(
//           (thread_id = myThread.id)
//         );

//         console.log(
//           "------------------------------------------------------------ \n"
//         );

//         console.log("User: ", myThreadMessage.content);
//         console.log("Assistant: ", allMessages.data[0].content);

//         break;
//       } else if (
//         keepRetrievingRun.status === "queued" ||
//         keepRetrievingRun.status === "in_progress"
//       ) {
//         // pass
//       } else {
//         console.log(`Run status: ${keepRetrievingRun.status}`);
//         break;
//       }
//     }
//   };
//   retrieveRun();
// }

// main();
