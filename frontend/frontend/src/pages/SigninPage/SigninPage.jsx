import "./SigninPage.css"

import { SigninForm } from "../../components/auth/SigninForm/SigninForm";
export const SigninPage = ({ children }) => {
  return (
    <main className="signin__form--container">
      <SigninForm />
    </main>
  );
};
