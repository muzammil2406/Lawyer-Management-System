"use client";

import FormHeader from "@/components/shared/form-header";
import { Building2 } from "lucide-react";
import CaseForm from "../components/case-form";

type Props = {};
const Page = (props: Props) => {
  return (
    <>
      <FormHeader title="New Case" Icon={Building2} backUrl="/casemanagement/case" />
      <CaseForm />
    </>
  );
};

export default Page;
