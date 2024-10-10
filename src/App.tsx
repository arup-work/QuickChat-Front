import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Layout/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "./redux";

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <>
      {isAuthenticated && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;
