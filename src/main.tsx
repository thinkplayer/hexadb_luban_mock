import ReactDOM from "react-dom/client";
import router from "./router/router.tsx";
import { RouterProvider } from "react-router-dom";
import "./index.less";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
