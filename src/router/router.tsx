import { createBrowserRouter } from "react-router-dom";
import DataModel from "../pages/dataModel";

const router = createBrowserRouter([
  {
    path: "/data-model",
    element: <DataModel />,
  },
]);

export default router;
