import { createBrowserRouter } from "react-router-dom";
import DataModel from "../pages/DataModel";

const router = createBrowserRouter([
  {
    path: "/data-model",
    element: <DataModel />,
  },
]);

export default router;
