import { SignIn } from "@clerk/clerk-react"
import './signinPage.css'

const SigninPage = () => {
  return (
    <div className="signInPage">
      <SignIn
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </div>
  )
}

export default SigninPage