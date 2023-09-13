import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import InvoiceView from "./pages/invoices";
import Home from "./pages/home-view";
import AuthPage from "./pages/auth-view";
import LoginForm from "./pages/login-form";
import SignUpForm from "./pages/sign-up-form";
import { Protected } from "./components/Protected";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Protected />}>
          <Route path="/" element={<Home />} />
          <Route path="/invoice" element={<InvoiceView />} />
        </Route>
        <Route path="/auth" element={<AuthPage />}>
          <Route index element={<Navigate replace to="sign-in" />} />
          <Route path="sign-in" element={<LoginForm />} />
          <Route path="sign-up" element={<SignUpForm />} />
          <Route path="*" element={<Navigate to={"/404"} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
