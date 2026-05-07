import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./screens/Dashboard";
import { AddSubscription } from "./screens/AddSubscription";
import { Analytics } from "./screens/Analytics";
import { History } from "./screens/History";
import { Reminders } from "./screens/Reminders";
import { ServiceDetails } from "./screens/ServiceDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/analytics",
    Component: Analytics,
  },
  {
    path: "/add",
    Component: AddSubscription,
  },
  {
    path: "/history",
    Component: History,
  },
  {
    path: "/reminders",
    Component: Reminders,
  },
  {
    path: "/service/:serviceName",
    Component: ServiceDetails,
  },
]);
