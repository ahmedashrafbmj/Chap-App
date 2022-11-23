import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Chat from "./components/chat/Chat";


export default function Router() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/chats" element={<Chat/>} />
            {/* <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }