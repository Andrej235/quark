import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./components/homepage";
import Login from "./components/login";
import Signup from "./components/signup";
import InboxMail from "./components/inbox-mail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/signup" element={<Signup></Signup>} />
        <Route path="/home" element={<Homepage></Homepage>} />
        <Route path="#inbox" element={<InboxMail></InboxMail>} />
      </Routes>
    </BrowserRouter>
  );
}
