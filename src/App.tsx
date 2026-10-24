
import { useAuthenticator } from "@aws-amplify/ui-react";
import Dashboard from "./components/Dashboard";

function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <Dashboard
      username={user?.signInDetails?.loginId ?? "User"}
      onSignOut={signOut}
    />
  );
}

export default App;

