"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {   
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { Case } from "@/types/case-type";
import { Phone,MapPin, Mail } from "lucide-react";


export const CaseColumns = ({
  onView = () => {},
  onEdit = () => {},
}: {
  onView?: (data: Case) => void;
  onEdit?: (data: Case) => void;
}): ColumnDef<Case>[] => {


  const [selectedCourt, setSelectedCourt] = useState<Case | null>(null);
  const router = useRouter();

  return [
    {
      accessorKey: "case_title",
      header: () => <div className="p-2 text-left whitespace-nowrap">Case Title | Case No. | Dt</div>,
      cell: ({ row }) => {
        const date = row.original.createdAt
          ? new Date(row.original.createdAt)
          : new Date();
    
        return (
          <div className="space-y-2">
            <div className="text-lg font-bold">{row.original.case_title}</div>
            <div className="h-4" />
            <div className="text-sm">
              <span className="text-primary hover:text-primary/60">No.:</span>{" "}
              <Link
                className="text-primary hover:text-primary/60"
                href={`/casemanagement/case/${row.original.caseid}`}
                
              >
                {row.original.case_no}
                {row.getValue('case_no')}
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Dt:</span> {date.toLocaleString()}
            </div>
          </div>
        );
      },
    },
    
    {
      accessorKey: "judge",
      header: () => <div className="p-2 text-left whitespace-nowrap">Court | Judge</div>,
      cell: ({ row }) => (
        <div className="space-y-2">
          <div className="font-bold">{row.original.court_name}</div>
          <div className="flex items-start gap-2 text-base">
            <MapPin
              className="w-auto h-auto text-gray-600 mt-1"
              style={{ fontSize: "1em" }}
            />
            <span className="leading-tight">
              {row.original.court_address} , {row.original.court_state}, {row.original.court_city} -{" "}
              {row.original.court_pincode}
            </span>
          </div>
          <div className="h-4" />
          <div>
            <span>Judge: </span>
            <span className="font-bold">{row.original.judge_full_name || "-NA-"}</span>
          </div>
          <div>
            <span>Last Judge: </span>
            <span className="font-bold">{row.original.last_judge || "-NA-"}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "client",
      header: () => <div className="p-2 text-left whitespace-nowrap">Client Details</div>,
      cell: ({ row }) => (
        <div className="space-y-2">
          <div className="font-bold">{row.original.clientname}</div>
          <div className="flex items-start gap-2 text-base">
            <MapPin
              className="w-auto h-auto text-gray-600 mt-1"
              style={{ fontSize: "1em" }}
            />
            <span className="leading-tight">
              {row.original.client_address} , {row.original.state}, {row.original.city} -{" "}
              {row.original.pincode}
            </span>
          </div>
          <div className="h-4" />
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-600" />
            {row.original.contact}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-600" />
            {row.original.email}
          </div>
        </div>
      ),
    }, 
    {
      accessorKey: "party",
      header: () => <div className="p-2 text-left whitespace-nowrap">Party Details</div>,
      cell: ({ row }) => (
        <div className="space-y-2">
          <div className="font-bold">{row.original.partyname || "-NA-"}</div>
          <div className="flex items-start gap-2 text-base">
            <MapPin
              className="w-auto h-auto text-gray-600 mt-1"
              style={{ fontSize: "1em" }}
            />
            <span className="leading-tight">
              {row.original.partyaddress
                ? `${row.original.partyaddress} ,${row.original.partystate || "-NA-"}, ${row.original.partypincode || "-NA-"}`
                : "-NA-"}
            </span>
          </div>

          <div className="h-4" />
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-600" />
            {row.original.partycontact || "-NA-"}
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-600" />
            {row.original.partyemail || "-NA-"}
          </div>
        </div>
      ),
    },
    
    {
      accessorKey: "assigned_to",
    
      header: () => (
        <div className="p-2 text-left whitespace-nowrap">Assigned to</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="align-top">
            <b>{row.original.assigned_to}</b>
            <br />
            {'L' === row.original.advocate_law_firm ? "Law Firm" : "Advocate"}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedon",
      header: () => <div className="p-2 text-left whitespace-nowrap">Status | Updated On | By</div>,
      cell: ({ row }) => {
        const date = row.original.updatedon ? new Date(row.original.updatedon) : new Date();
        return (
          <div className="flex flex-col space-y-1">
              <div
                className={`px-2 py-1 rounded text-white font-medium text-center w-[60%] 
                  ${row.original.status_name === "Close" ? "bg-green-500" :
                    row.original.status_name === "In-Progress" ? "bg-yellow-500" :
                    row.original.status_name === "New" ? "bg-gray-500" :
                    "bg-gray-500"}`}
              >
              {row.original.status_name}
              </div>
              <br />
              <div className="text-sm flex flex-col">
                <span>by: {row.original.statusupdatedbyfullname}</span>
                <span>on: {date.toLocaleString()}</span>
              </div>

          </div>
        );
          },
        },
    
    

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const Case = row.original;
        const router = useRouter();
    
        return (
          <div className="flex flex-col gap-1 text-sm text-gray-800">
            <label
              className="cursor-pointer hover:text-blue-600"
              onClick={() => router.push(`/casemanagement/case/${Case.caseid}`)}
            >
              View
            </label>
            <label
              className="cursor-pointer hover:text-blue-600"
              onClick={() => router.push(`/casemanagement/case/edit/${Case.caseid}`)}
            >
              Edit
            </label>
            <label
              className="cursor-pointer hover:text-blue-600"
              onClick={() => router.push(`/casedate/new/${Case.caseid}`)}
            >
              Add Case Date
            </label>
            <label
              className="cursor-pointer hover:text-blue-600"
              onClick={() => router.push(`/casedate/case/${Case.caseid}`)}
            >
              {Case.case_date_count || 0} Dates
            </label>
          </div>
        );
      },
    },  
  ];
};