import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Copy, CreditCard, MoreVertical, Truck } from "lucide-react";
import { Case } from "@/types/case-type";

type CaseOverviewProps = {
  data:Case;
};
const CaseOverview = ({ data }: CaseOverviewProps) => {
  return (
    <>
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
                <div className="flex-col">
                <div className="text-slate-500 text-sm">Case No.: {data?.case_no}</div>
                <div className="text-slate-500 text-sm">Case Title: {data?.case_title}</div>
               </div>
            </CardTitle>
            </div>
        </CardHeader>

        <CardContent className="p-6 text-sm">
            <Separator className="my-4" />
            <div className="grid gap-3">
            {/* <div className="font-semibold">Contact Details</div> */}
            <ul className="grid gap-3">
                {[
                ["Clientid", data?.clientid],
                ["Appearing For", data?.appearingfor],
                ["Opponent Party", data?.partyname],
                ["Court Name", data?.court_name],
                ["Judge Name", data?.judge_full_name],
                ["Last Judge", data?.last_judge],
                ["Advocate/Law Firm?", data?.advocate_law_firm],
                ["Opposing Advocate/Law Firm?", data?.opposing_advocate_law_firm],
                ["Pre Advocate/Law Firm", data?.prev_advocate_law_firm],
                ["Reference Advocate", data?.ref_advocate],
                ["Case Notes ", data?.case_notes],
                ["Other info", data?.other_info],
                ["Status", data?.status_name],
                ["Status Remarks", data?.status_remarks],
                
                ].map(([label, value], index) => (
                <li key={index} className="flex justify-between border-b pb-2" draggable="true">
                    <div className="flex gap-2">
                    <span className="text-muted-foreground">{label}:</span>
                    <span className="font-medium">{value}</span>
                    </div>
                </li>
                ))}
            </ul>
            </div>

            {/* <Separator className="my-4" />
            <div className="grid gap-3">
            <div className="font-semibold">Address Details</div>
            <ul className="grid gap-3">
                {[
                // ["Address", data?.address],
                // ["Country", data?.country],
                ["State", data?.state],
                ["City", data?.city],
                ["Pin Code", data?.pincode],
                ].map(([label, value], index) => (
                <li key={index} className="flex justify-between border-b pb-2" draggable="true">
                    <div className="flex gap-2">
                    <span className="text-muted-foreground">{label}:</span>
                    <span className="font-medium">{value}</span>
                    </div>
                </li>
                ))}
            </ul>
            </div> */}
        </CardContent>
        </Card>
</>
  );
};

export default CaseOverview;
