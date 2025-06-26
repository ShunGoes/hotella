"use client";

import CardWrapper from "./card-wrapper";
import { BeatLoader } from "react-spinners";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { newVerification } from "@/actions/new-verification";
import FormSuccess from "../form-success";
import FormError from "../form-error";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const SearchParams = useSearchParams();

  const token = SearchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("TMissing Token");
      return;
    }

    try {
      const data = await newVerification(token);
      console.log(data);
      setError(data?.error);
      setSuccess(data?.success);
    } catch (error) {
      setError("An Error occurred");
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonRef="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center justify-center w-full">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
