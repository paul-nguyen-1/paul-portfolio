import { Controller, Post, Body } from '@nestjs/common';
import { GptService } from './gpt.service';
import { PAUL_PROFILE } from 'src/prompts/paul.profile';
import { buildPaulSystemPrompt } from 'src/prompts/paul.system';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('respond-as-paul')
  async respondAsPaul(
    @Body() body: { message: string },
  ): Promise<{ reply: string }> {
    const system = buildPaulSystemPrompt(PAUL_PROFILE);
    const reply = await this.gptService.chatWithSystem(system, body.message);
    return { reply };
  }
}
