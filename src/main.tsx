import ReactDOM from "react-dom/client";
import router from "./router/router.tsx";
import { RouterProvider } from "react-router-dom";
import "./index.less";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);

const base = 1920 / 60;
const resize = () => {
  const clientWidth = document.body.clientWidth;
  document.documentElement.style.fontSize = `${clientWidth / base}px`;
};
window.addEventListener("resize", resize);
resize();
