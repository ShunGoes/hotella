import CardWrapper from "@/components/auth/card-wrapper"
import LoginForm from "@/components/auth/loginForm"

const LoginPage = () => {
  return (
    <CardWrapper headerLabel="Welcome back" backButtonLabel="Don't have an account?" backButtonRef="/auth/register" showSocial={true}>
        <LoginForm />
    </CardWrapper>
  )
}

export default LoginPage