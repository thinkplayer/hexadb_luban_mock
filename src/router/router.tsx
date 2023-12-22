import { createBrowserRouter } from "react-router-dom";
import DataModel from "../pages/DataModel";
import CanvasWrap from "../pages/CanvasWrap";
import Grid from "../pages/Grid";

const router = createBrowserRouter([
  {
    path: "/data-model",
    element: <DataModel />,
  },
  {
    path: "/data-model2",
    element: <CanvasWrap />,
  },
  {
    path: "/grid",
    element: <Grid />,
  },
]);

export default router;
