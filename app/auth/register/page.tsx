import CardWrapper from "@/components/auth/card-wrapper"
import RegisterForm from "@/components/auth/register-form"

const RegisterPage = () => {
  return (
    <CardWrapper headerLabel="Register Now" backButtonLabel="Have an account? Log in" backButtonRef="/auth/login" showSocial={true}>
        <RegisterForm />
    </CardWrapper>
  )
}

export default RegisterPage