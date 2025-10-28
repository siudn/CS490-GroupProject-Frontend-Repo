// sample routes - write out your routes like this (replace the actual routes/elements with your pages)
import { lazy } from "react";
const SignIn = lazy(() => import("./pages/SignIn.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));

export default [
  { path: "/auth/sign-in", element: <SignIn /> },
  { path: "/auth/sign-up", element: <SignUp /> },
  { path: "/auth/forgot-password", element: <ForgotPassword /> },
  { path: "/auth/reset-password", element: <ResetPassword /> },
];