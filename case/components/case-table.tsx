"use client";
import { DataTable } from "@/components/shared/data-table";
import React, { useEffect, useMemo } from "react";
import { CaseColumns } from "../../case/columns";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { atomCompany } from "@/stores";
import { CircleCheck, CircleIcon, CircleX } from "lucide-react";
import Confirmation from "@/components/shared/confirmation";
import { Icon } from "@/types/common-types";
import { useDeleter } from "@/hooks/use-query";
import Toast from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react"; // Importing icons
import { Case } from "@/types/case-type";


type Props = { caseList: Case[] };

const PopupTable = ({ caseList }: Props) => {
  const router = useRouter();
  const [company, setCompany] = useAtom(atomCompany);

  const handleRowClick = (row: Case) => {
    console.log("row", row);
  };

  const handleRowView = (row: Case) => {
    router.push(`/casemanagement/case/edit/${row.caseid}`);
  };

  return (
<div>
   <section>
    <h2 className="text-lg font-semibold mb-2">Filter</h2> {/* Filter Title */}
    <div className="p-5 border rounded-lg shadow-md mb-2"> {/* Box for filters */}
      <div className="mb-1">
        <div className="flex flex-wrap items-center gap-2"> {/* Flexbox for single-line layout */}

          <select className="border p-2 w-60 rounded-lg"> 
            <option>--Select City--</option>
          </select>
          <input type="text" className="border p-2 w-60 rounded-lg" placeholder="Search Case..." />
          <input type="text" className="border p-2 w-60 rounded-lg" placeholder="Search Contact/Mobile..." />
          <Button className="bg-yellow-500 p-2 px-8 rounded-lg">Search</Button> {/* Button with rounded corners */}
        </div>
      </div>
    </div>
  </section>
    
            
  {/* Filter Section */}
 
        {/* Data Table */}
        <DataTable
          columns={CaseColumns({ onView: (e) => handleRowView(e) })}
          data={caseList}
          showSearch={false}
          onRowClick={handleRowClick}
          showPagination={true}
          paginationOptions={{ showRowCount: true, showPageSize: true }}
          exportOptions={{ csv: true, pdf: true, filename: "case", title: "Case List" }}
        />
      
    </div>
  );
};

export default PopupTable;
