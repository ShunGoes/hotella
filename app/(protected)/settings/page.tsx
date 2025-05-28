import { auth, signOut } from "@/auth";
import { addAndRemoveAdminEmail } from "@/lib/queryDatabse";
import React from "react";

const SettingsPage = async () => {
  const sessions = await auth();
  const {name, image, role, emailVerified, provider,email } = sessions?.user || {}
  return (
    <div>
      {/* {JSON.stringify(sessions)} */}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
   {
    sessions?.user && (
      <ul>
      <li>{name} </li>
      <li>{image} </li>
      <li>{email} </li>
      <li>{role} </li>
      <li>{emailVerified || "nothing"} </li>
      <li>{provider} </li>
    </ul>
    )
   }
        <button type="submit">Sign Out</button>
      </form>
      <form
        action={async () => {
          "use server";
          await addAndRemoveAdminEmail(sessions?.user?.email!, "add")
        }}
      >
        <button type="submit">Add Admin</button>
      </form>
    </div>
  );
};

export default SettingsPage;
