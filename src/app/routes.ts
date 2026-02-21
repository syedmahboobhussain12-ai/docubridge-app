// Correcting paths based on your structure: src/app/pages/
import { Login } from "./pages/login";
import { StudentDashboard } from "./pages/student-dashboard";
import { MentorDashboard } from "./pages/mentor-dashboard";
import { AdminDashboard } from "./pages/admin-dashboard";

export const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/student-dashboard",
    component: StudentDashboard,
  },
  {
    path: "/mentor-dashboard",
    component: MentorDashboard,
  },
  {
    path: "/admin-dashboard",
    component: AdminDashboard,
  },
];