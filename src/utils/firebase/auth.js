import { auth } from ".";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

const AuthUserContext = createContext({
  authUser: null,
  userIsLoading: true,
});

const useFirebaseAuth = function () {
  const [authUser, setAuthUser] = useState(null);
  const [userIsLoading, setUserIsLoading] = useState(true);

  const authStateChangeHandler = async (user) => {
    setUserIsLoading(true);
    if (!user) {
      setAuthUser(null);
      setUserIsLoading(false);
      return;
    }
    // alert("State changed");
    setAuthUser({ ...user });
    // console.log({ ...user });
    // console.log(authUser);
    setUserIsLoading(false);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChangeHandler);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    userIsLoading,
  };
};

const AuthUserProvider = function ({ children }) {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

const useAuth = () => useContext(AuthUserContext);
export { AuthUserProvider, useAuth };
