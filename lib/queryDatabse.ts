import Settings from "@/models/settings";
import User from "@/models/user";
import conn from "./db";

export const getExistingUser = async (email: string) => {
  const user = await User.findOne({ email });
  if (user) return user;

  return false;
};

/**
 * THIS FUNCTION CHECKS AGAINST THE DATABSE FOR REGISTERED ADMIN EMAILS
 */
export const isAdminEMail = async (email: string): Promise<boolean> => {
  try {
    await conn();
    const listOfAdminEmails = await Settings.findOne({ key: "adminEmails" });

    if (!listOfAdminEmails) return false;

    const adminEmail = listOfAdminEmails.value.includes(
      email.toLowerCase().trim()
    );

    return adminEmail;
  } catch (error) {
    console.log("this user is not an admin user", error);
    return false;
  }
};

/**
 * THIS FUNCTION ADDS EMAILS TO THE ADMIN DATABSE
 */
export const addAndRemoveAdminEmail = async (email: string, action: string) => {
  try {
    await conn();

    // >>>>> FIND A DOCUMENT OR CREATE ONE IF IT DOESN'T EXIST <<<<<<<<<
    let listOfAdminEmails = await Settings.findOne({ key: "adminEmails" });

    if (!listOfAdminEmails) {
      listOfAdminEmails = await Settings.create({
        key: "adminEmails",
        value: [],
      });
    }

    let emailList = [...listOfAdminEmails.value];

    // >>>>>>> CHECK IF ADMIN EXIST ON THE DATBASE. IF TRUE, DELETE THE ADMIN AND ID THE ADMIN DOESN'T EXIST, CREATE A NEW ADMIN
    if (action.toLowerCase() === "add") {
      if (!emailList.includes(email.toLowerCase().trim())) {
        emailList.push(email.toLowerCase().trim());
      }
    } else if (action.toLowerCase() === "remove") {
      emailList = emailList.filter(
        (e: string) => e !== email.toLowerCase().trim()
      );
    }

    console.log("Current email list:", listOfAdminEmails.value);
    console.log("New email list:", emailList);

    if (JSON.stringify(listOfAdminEmails.value) !== JSON.stringify(emailList)) {
      listOfAdminEmails.value = emailList;
      listOfAdminEmails.markModified("value");

      await listOfAdminEmails.save();
      console.log("admin email list updated successfully");
    } else {
      console.log("no changes to admin email list");
    }

    // >>>>>>>>>>>>>>>>>>> UPDATE USER ROLE <<<<<<<<<<<<<<<<
    const user = await User.findOne({ email });

    if (!user) {
      console.log("user not found");
      return null;
    }

    const newUserRole = emailList.includes(user.email.toLowerCase())
      ? "admin"
      : "user";

    if (user.role !== newUserRole) {
      user.role = newUserRole;
      await user.save();

      console.log("user role has been updated to", newUserRole);
      // await User.updateOne({ email }, { $set: { role: newUserRole } });
    } else {
      console.log("user already has row");
      return null;
    }
    return {
      success: true,
      adminEmails: emailList,
    };
  } catch (error) {
    console.log("user role not changed due to ", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    } else {
      return {
        success: false,
        error: error,
      };
    }
  }
};


export const getUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("no user with such email found");
      return null;
    }

    return user;
  } catch (error) {
    console.log(error);
  }
};
