"use client";

import FormHeader from "@/components/shared/form-header";
import CaseForm from "../../components/case-form";
import { Building2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useFetcher } from "@/hooks/use-query";
import { ThreeDots } from "react-loader-spinner";
import { useEffect } from "react";


type Props = {};
const Page = (props: Props) => {
  const param = useParams();
  
  const { data,isLoading,refetch ,isSuccess} = useFetcher(
    `/casemanagement/case/${param.id}`,
    "casebyid"
  );

  useEffect(()=>{
    console.log(data)
  },[])
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <section className="p-5">
          <ThreeDots
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </section>
      </div>
    );

    
  }
  return (
    <>
      <FormHeader title="Edit Case" Icon={Building2} backUrl="/casemanagement/case" />
      <CaseForm CaseType={data} />
    </>
  );
};

export default Page;
