import './signupPage.css'
import { SignUp } from '@clerk/clerk-react'

const SignupPage = () => {
  return (
    <div className='signUpPage'>
     <SignUp
        path="/sign-up" signInUrl="sign-in"
      />
    </div>
  )
}

export default SignupPage