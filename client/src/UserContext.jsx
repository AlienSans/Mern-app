import { createContext, useState } from "react";

const UserContext = createContext({});

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);

  return (
    <UserContext.Provider
      value={{ user, setUser, ready, setReady, session, setSession }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { Provider };
export default UserContext;
