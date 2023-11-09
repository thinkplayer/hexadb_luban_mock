import { createBrowserRouter } from "react-router-dom";
import DataModel from "../pages/DataModel";
import CanvasWrap from "../pages/CanvasWrap";

const router = createBrowserRouter([
  {
    path: "/data-model",
    element: <DataModel />,
  },
  {
    path: "/data-model2",
    element: <CanvasWrap />,
  },
]);

export default router;
