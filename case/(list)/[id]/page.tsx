"use client";

import FormHeader from "@/components/shared/form-header";
import Caseform from "../../components/case-form";
import { Building2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useFetcher } from "@/hooks/use-query";
import { ThreeDots } from "react-loader-spinner";
import { useEffect } from "react";
import CaseOverview from "../../components/case-form-overview";

type Props = {};
const Page = (props: Props) => {
  const param = useParams(); // Access dynamic route parameters

  const { data, isLoading } = useFetcher(
    `http://localhost:4000/case/case/${param.id}`,
    "casebyid"
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <section className="p-5">
          <ThreeDots
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="loading-indicator"
          />
        </section>
      </div>
    );
  }

  const handleClose = () => {
    // Navigate back to the roles list
    window.location.href = "/casemanagement/case";
  };

  return (
    
      <div className="p-2">
        <CaseOverview data={data}/>
      </div>
   
  );
};

export default Page;
