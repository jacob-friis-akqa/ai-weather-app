import { v0 } from "v0-sdk";

// Create a new chat
const chat = await v0.chats.create({
  message: "Create a responsive navbar with Tailwind CSS",
});

// Use the Demo URL in an iframe
export function WeatherChat() {
  <>
    <input type="text" name="location" id="location" />
    <iframe src={chat.demo} width="100%" height="600"></iframe>;
  </>;
  return <iframe src={chat.demo} width="100%" height="600"></iframe>;
}
