import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

  const token = localStorage.getItem("token");
  const tokenValido =
    token &&
    token !== "undefined" &&
    token !== "null";

  return tokenValido
    ? children
    : <Navigate to="/login" replace />;
}

export default PrivateRoute;
