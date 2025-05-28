import mongoose from "mongoose"

const connectionString = process.env.MONGO_URI

const conn = async () => {
    try {
        if (!connectionString){
            throw new Error("MongoDB connection string is missing")
        }

        await mongoose.connect(connectionString)
        console.log("connection to MongoDB successful")

    } catch (error) {
        console.log("error connecting to db", error)
            // throw new Error("Error connecting to the database", error ?? "")
        
    }
}

export default conn