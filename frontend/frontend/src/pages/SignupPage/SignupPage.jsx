import "./SignupPage.css"
import { SignupForm } from "../../components/auth/SignupForm/SignupForm";

export const SignupPage = ({ children }) => {
  return (
    <main className="signup__form--container">
      <SignupForm />
    </main>
  );
};
