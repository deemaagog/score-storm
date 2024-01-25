import { Score } from 'mnxconverter';
import { RenderParams } from '.';

export interface Renderer {
  render(score: Score ,params: RenderParams): void
}
