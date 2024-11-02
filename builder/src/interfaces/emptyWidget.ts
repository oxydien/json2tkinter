import type Widget from "./widget";

export default interface EmptyWidget {
  id?: string;
  content?: Widget[];
  defaults?: object;
  text?: string;
  kind?: string;
  options?: string[];
  execute?: string;
}
