import BackButton from "./back-button"
import Header from "./header"


import {
    Card,
    CardFooter,
    CardHeader
} from "@/components/ui/card"



const ErrorCard = () => {
return (
   <Card className="w-[400px] shadow-md">
    <CardHeader>
        <Header label="Something went wrong"/>
    </CardHeader>
    <CardFooter>
        <BackButton label="Go back" href="/auth/login" />
    </CardFooter>
   </Card>
)
}

export default ErrorCard