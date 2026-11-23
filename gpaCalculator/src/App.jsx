import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./components/Login";
import { Navbar } from "./components/Navbar";
import Gpa from "./routes/Gpa";
import Grade from "./routes/Grade";
import Home from "./pages/Home";
import Classes from "./routes/Classes";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import "./App.css";
import { AppFooter, RouteFocus } from "./components/ui/Ui";
import { ClassProvider } from "./context/ClassesContext";
import SignUp from "./components/SignUp";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <ClassProvider>
          <Router>
            <Navbar />
            <RouteFocus />
            <main
              id="main-content"
              tabIndex={-1}
            >
              <AppRoutes />
            </main>
            <div className="page-shell footer-shell">
              <AppFooter />
            </div>
          </Router>
        </ClassProvider>
      </AuthProvider>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <Routes key={user?.uid || "guest"}>
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/gpa"
        element={<Gpa key={location.key} />}
      />
      <Route
        path="/grade"
        element={<Grade />}
      />
      <Route
        path="/classes"
        element={
          <PrivateRoute>
            <Classes />
          </PrivateRoute>
        }
      />
      <Route
        path="/feedback"
        element={<Feedback />}
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;
