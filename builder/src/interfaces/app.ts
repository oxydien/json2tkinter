import type Widget from "./widget";

export default interface App {
  title: string;
  geometry: string;
  version: string;
  content: Widget[];
}
