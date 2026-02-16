import { createBrowserRouter } from "react-router";
import { Login } from "./pages/login";
import { StudentDashboard } from "./pages/student-dashboard";
import { MentorDashboard } from "./pages/mentor-dashboard";
import { AdminDashboard } from "./pages/admin-dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/student",
    Component: StudentDashboard,
  },
  {
    path: "/mentor",
    Component: MentorDashboard,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);
