export default interface Widget {
  index: number;
  type: string;
  id: string;
  content?: Widget[];
  kind?: string;
  defaults?: object;
  text?: string;
  options?: string[];
  execute?: string;
}
