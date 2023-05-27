import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../UserContext";

function AccountPage() {
  const { ready, user } = useContext(UserContext);

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }

  return <div>AccountPage {user.name}</div>;
}

export default AccountPage;
