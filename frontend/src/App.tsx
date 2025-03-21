
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Voting from "./pages/Voting";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import Auth from "./pages/Auth";
import DahLayout from "./components/dashboard/DashLayout";
import CreateElection from "./pages/dashboard/CreateElection";
import AddCandidates from "./pages/dashboard/AddCandidates";
import ReviewElection from "./pages/dashboard/ReviewElection";
import RegistrationPage from "./pages/Register";
// import Register from "./pages/Register";
// import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/voting/:electionId" element={<Voting />} />
          <Route path="/results/:electionId" element={<Results />} />
          <Route path="*" element={<NotFound />} />

          <Route element={<DahLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-election" element={<CreateElection />} />
            <Route path="/add-candidates" element={<AddCandidates />} />
            <Route path="/review-election" element={<ReviewElection />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;