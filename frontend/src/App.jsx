import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import SpotsView from "./components/SpotsView/SpotsView";
import SpotIdView from "./components/SpotIdView/SpotIdView";
import CreateSpot from "./components/CreateSpot/CreateSpot";
import SpotsManageView from "./components/SpotsManageView/SpotsManageView";
import * as sessionActions from './store/session';
import UpdateSpot from "./components/UpdateSpot/UpdateSpot";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUserThunk()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsView />,
      },
      {
        path: ':id',
        element: <SpotIdView />
      },
      {
        path: '/new',
        element: <CreateSpot />
      },
      {
        path: '/manage',
        element: <SpotsManageView />
      },
      {
        path: '/manage/:id',
        element: <UpdateSpot />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
