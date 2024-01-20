import { HfInference } from '@huggingface/inference';
import { Message } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const { message } = await req.json();
  const messages: Message = {
    id: '1',
    content: message,
    role: 'user'
  }
  const response = await Hf.textGeneration({
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    inputs: experimental_buildOpenAssistantPrompt([messages]),
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });
  
  return new Response(response.generated_text)
}
