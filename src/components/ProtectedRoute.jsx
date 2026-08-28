import React, { useContext } from "react";
import { userContext } from "../context/UserContext";
import { Navigate } from "react-router";

export default function ProtectedRoute({children}) {
  const { token } = useContext(userContext);

  if (!token) {
    return <Navigate to={"/signin"}/>
  } else {
    return children
  }
}
