import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/authentication/login";
import Signup from "./components/authentication/signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/signup" element={<Signup></Signup>} />
      </Routes>
    </BrowserRouter>
  );
}
