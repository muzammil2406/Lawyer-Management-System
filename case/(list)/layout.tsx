"use client";
import FormHeader from "@/components/shared/form-header";

// import ClientTable from "../components/client-table";
import { cn } from "@/lib/utils";
import { atomShowPanel } from "@/stores";
import FormToolBar from "@/components/shared/form-toolbar";
import { Button } from "@/components/ui/button";
import { Building2, Edit, Printer } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import CaseTable from "../components/case-table";
import { useFetcher } from "@/hooks/use-query";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showPanel, setShowPanel] = useAtom(atomShowPanel);
  const {data,isLoading}=useFetcher(`/case/case`,"case")
  const router = useRouter();
  const { id } = useParams();
  
  
  useEffect(() => {
   
    
    setShowPanel(!!id);
    console.log(id)
   
  }, [showPanel, id]); // Dependency array

  
  

  return (
    <div className="flex max-w-7xl">
      <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border"
    >
        {/* left side panel */}
      <ResizablePanel defaultSize={50} >
      <FormHeader title="Case List" newUrl="/casemanagement/case/new" Icon={Building2} />
        <div className="overflow-y-auto">
          <CaseTable caseList={data} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      {/* right side panel */}
      <ResizablePanel defaultSize={50} hidden={!showPanel}>
      <FormToolBar
          className="sticky top-0 bg-background "
          title="Case Detail"
          url="/casemanagement/case"   
        >
          <div className="flex gap-2 text-primary w-full justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push(`edit/${id}`)}
                >
                  <Edit />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <span>Edit</span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => window.print()}>
                  <Printer />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <span>Print</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </FormToolBar>
        <div className="max-h-full overflow-auto p-5">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
    </div>
  );
}
