import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import InvoicePage from "./pages/invoices";
import AuthPage from "./pages/auth-view";
import LoginForm from "./pages/login-form";
import SignUpForm from "./pages/sign-up-form";
import { Protected } from "./components/Protected";
import Home from "./pages/home-view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ViewInvoicePage from "./pages/view-invoices";
import AppUrlListener from "./AppUrlListener";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppUrlListener></AppUrlListener>
        <Routes>
          <Route element={<Protected />}>
            <Route path="/" element={<Home />} />
            <Route path="/invoice/new" element={<InvoicePage />} />
            <Route path="/invoice/:id" element={<ViewInvoicePage />} />
          </Route>
          <Route path="/auth" element={<AuthPage />}>
            <Route index element={<Navigate replace to="sign-in" />} />
            <Route path="sign-in" element={<LoginForm />} />
            <Route path="sign-up" element={<SignUpForm />} />
            <Route path="*" element={<Navigate to={"/404"} />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
