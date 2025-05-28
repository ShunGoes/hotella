import mongoose, {Schema, InferSchemaType} from "mongoose";

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {
        type: String,
        required: function(this:any) {
          // Only require password for credentials-based authentication
          return this.provider === 'credentials';
        },
      },
      provider: {
        type: String,
        default: 'credentials', // Default is credentials-based login
      },
    role: {type: String, enum: ["admin", "user"], default: "user"},
    emailVerified: {type: Date, default: null},
    verificationToken: {type: String},
    verificationTokenExpiry: {type: Date}
}
)

// Infer the type from the schema. More like extending from the mongoose Document
export type UserType = InferSchemaType<typeof UserSchema>;


const User = mongoose.models?.User || mongoose.model("User", UserSchema)

export default User






