import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import History from "./pages/History";
import Favorites from "./pages/Favorites";
import TestAPI from "./pages/TestAPI";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "search",
        Component: SearchResults,
      },
      {
        path: "history",
        Component: History,
      },
      {
        path: "favorites",
        Component: Favorites,
      },
      {
        path: "test-api",
        Component: TestAPI,
      },
    ],
  },
]);