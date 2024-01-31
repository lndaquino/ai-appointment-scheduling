## AI driven agent to schedule appointments

This project is a proof-of-concept on how to combine an open-source LLM in a chat based AI driven agent 
that helps to schedule an appointment.

The main concepts are the usage of a state machine that coordinates a LLM to perform name-entity recognition/extraction (NER), as well as generating messages while conducting the chat.

There is a calendar available showing the already booked appointments, as well the newly created one when all the flow is completed.

The mood selector allows to define the kind of message that the LLM will generate.

Hugginface is the API provider, where all inference using the LLM is done. The model used allows the usage of a free account.


## Running it locally
After renaming the .env.example to .env.local, add the Hugging Face's write token.

```bash
nvm use
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.


## Development
The usage of other LLM models is a future possibility, both paid and open-source ones.

Adding a voice layer (instead only chat) is also a future possibility.

Any contribution and suggestion, reach out to the contributors.
