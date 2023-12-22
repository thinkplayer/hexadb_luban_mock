import { createBrowserRouter } from "react-router-dom";
import DataModel from "../pages/DataModel";
import CanvasWrap from "../pages/CanvasWrap";
import Grid from "../pages/Grid";
import Px2Rem from "../pages/Px2Rem";

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
  {
    path: "/pxtorem",
    element: <Px2Rem />,
  },
]);

export default router;
