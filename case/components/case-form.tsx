"use client";
import FormFooter from "@/components/shared/form-footer";
// import moment from "moment";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { CompanyRegistrationSchema } from "@/schemas/company-schema";
import { Country, State, City, IState, ICity } from "country-state-city";
import Toast from "@/components/shared/toast";
import { cn } from "@/lib/utils";
import DatePicker from "@/components/ui/date-picker";
import { useFetcher, usePoster, useUpdater } from "@/hooks/use-query";
// import { Registration } from "@/types/company-type";
import { useParams, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { atomCompany } from "@/stores";
import { CaseSchema } from "@/schemas/case-schema";
import { ClientSchema } from "@/schemas/client.schema";
import { Case } from "@/types/case-type";
import { Client } from "@/types/client-type";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import ClientForm from "../../../contact/client/components/client-form";
import { atomShowClientPopup } from "@/stores";
import { useRef } from "react"
import Cookies from "js-cookie";

type CaseFormProps = {
  asDialog?: boolean;
  CaseType: Case;
  Client?:Client;
  readOnly?: boolean;
};
type FormInputs = z.infer<typeof CaseSchema> & z.infer<typeof ClientSchema>;


const CaseForm = ({ asDialog, CaseType, Client, readOnly }: CaseFormProps) => {
  const param = useParams();
  const [showClientPopup, setShowClientPopup] = useAtom(atomShowClientPopup);
  const router = useRouter();
  const form = useForm<FormInputs>({
    resolver: zodResolver(CaseSchema),
    defaultValues: CaseType
      ? {
          case_no: CaseType.case_no,
          case_title: CaseType.case_title,
          clientid: CaseType.clientid,
          partyid: CaseType.partyid,
          courtid: CaseType.courtid,
          judgeid: CaseType.judgeid,
          advocate_law_firm: CaseType.advocate_law_firm,
          advocate_law_firm_id: CaseType.advocate_law_firm_id,
          prev_advocate_law_firm: CaseType?.prev_advocate_law_firm,
          prev_advocate_law_firm_id: CaseType?.prev_advocate_law_firm_id,
          case_notes: CaseType?.case_notes,
          last_judge: CaseType?.last_judge,
          opposing_advocate_law_firm: CaseType?.opposing_advocate_law_firm,
          opposing_advocate_law_firm_id: CaseType?.opposing_advocate_law_firm_id,
          ref_advocate: CaseType?.ref_advocate,
          other_info: CaseType?.other_info,
          appearingforid: CaseType?.appearingforid,
          next_hearing_date: CaseType?.next_hearing_date,
          next_hearing_at: CaseType?.next_hearing_at,
          updatedon: CaseType?.updatedon,
          createdAt: CaseType?.createdAt,
          //count: CaseType.count,
          statusid: CaseType?.statusid,
        }
        : {statusid: 0,
          courtid: 0, 
          clientid: 0,},
  });

  // const setFormValue = () => {
  //   if(CaseType){
  //     form.setValue("case_title", CaseType.case_title!);
  //     form.setValue("clientname", CaseType.clientname!);
  //     form.setValue("opponent_party", CaseType.opponent_party!);
  //     form.setValue("court_name", CaseType.court_name!);
  //     form.setValue("judge_full_name", CaseType.judge_full_name!);
  //     form.setValue("advocate_law_firm", CaseType.advocate_law_firm!);
  //     form.setValue("prev_advocate_law_firm", CaseType.prev_advocate_law_firm!);
  //     form.setValue("case_notes", CaseType.case_notes!);
  //   }

  // };

  // const [selectedType, setSelectedType] = useState("A");
  // const [prevselectedType, setprevSelectedType] = useState("A");
  // const [oppselectedType, setoppSelectedType] = useState("A");

  const { data: clientdropdown } = useFetcher(
    `case/clientdropdown`,
    "clientList"
  );

  const { data: partydropdown } = useFetcher(
    `case/partydropdown`,
    "partydropdown"
  );

  const { data: courtdropdown } = useFetcher(
    `case/courtdropdown`,
    "courtdropdown"
  );

  const { data: nextcourtdropdown } = useFetcher(
    `case/nextcourtdropdown`,
    "nextcourtdropdown"
  );

  const { data: judgedropdown } = useFetcher(
    `case/judgedropdown`,
    "judgedropdown"
  );

  const { data: lastjudgedropdown } = useFetcher(
    `case/lastjudgedropdown`,
    "lastjudgedropdown"
  );

  const { data: advocatedropdown } = useFetcher(
    `case/advocatedropdown`,
    "advocatedropdown"
  );

  const { data: statusdropdown } = useFetcher(
    `case/statusdropdown`,
    "statusdropdown"
  );

  const gender = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female"},
    { label: "Others", value: "Others" },
  ];

  useEffect(() => {
    if (statusdropdown && statusdropdown.length > 0) {
      const defaultStatus = statusdropdown.find(
        (item: any) => item.status_name === "New"
      );
      if (defaultStatus) {
        form.setValue("statusid", defaultStatus.id); // Set "New" as default
      }
    }
  }, [statusdropdown, form]);

  const { data: appearingfordropdown } = useFetcher(
    `case/appearingfordropdown`,
    "appearingfordropdown"
    
  );

  const { data: advocate, refetch: fetchAdvdropdown } = useFetcher(
    `case/advocatedropdown`,
    "advocatedropdown",
    false
  );

  const { data: lawfirm, refetch: fetchLfdropdownn } = useFetcher(
    `case/lawfirmdropdown`,
    "lawfirmdropdown",
    false
  );
//prev al
  const { data: prevadvocate, refetch: fetchprevAdvdropdown } = useFetcher(
    `case/advocatedropdown`,
    "advocatedropdown",
    false
  );

  const { data: prevlawfirm, refetch: fetchprevLfdropdownn } = useFetcher(
    `case/lawfirmdropdown`,
    "lawfirmdropdown",
    false
  );

  //opposing
  const { data: oppadvocate, refetch: fetchoppAdvdropdown } = useFetcher(
    `case/advocatedropdown`,
    "advocatedropdown",
    false
  );

  const { data: opplawfirm, refetch: fetchoppLfdropdownn } = useFetcher(
    `case/lawfirmdropdown`,
    "lawfirmdropdown",
    false
  );

   const { data: ClientTypeList } = useFetcher(
      `/contact/clienttype`,
      "clienttype"
    );

  const [loggedincompanyid] = useState(Cookies.get("loggedincompanyid"));
  const [loggedinuserid] = useState(Cookies.get("loggedinuserid"));
  const { data:Courtaddress } = useFetcher(`/master/courtmaster`, "courtmaster");
  const [selectedCourtAddress, setSelectedCourtAddress] = useState<string>("");

  // const { data: advlfdropdownData, refetch: fetchAdvlfdropdown } = useFetcher(
  //   // "/casemanagement/advlfdropdown/advocate",
  //   `casemanagement/advlfdropdown/${selectedType}`,
  //   "advlfdropdown",
  //   false
  // );

    const countries = Country.getAllCountries().filter((f) =>
        ["IN"].includes(f.isoCode)
      );
    
      const Ownercountries = Country.getAllCountries().filter((f) =>
        ["IN"].includes(f.isoCode)
      );
    
    
      const [states, setStates] = useState<IState[]>([]);
      const [cities, setCities] = useState<ICity[]>([]);
    
      const [Ownerstates, setOwnerStates] = useState<IState[]>([]);
      const [Ownercities, setOwnerCities] = useState<ICity[]>([]);
    
      const onCountryChange = (e: string) => {
        const co = Country.getCountryByCode(e)?.name;
        form.setValue("country_code", e);
        form.setValue("country", co!);
      };
    
      const onOwnerCountryChange = (e: string) => {
        const con = Country.getCountryByCode(e)?.name;
        form.setValue("owner_country_code", e);
        form.setValue("owner_country", con!);
      };

      useEffect(() => {
            console.log('Client',Client)
            if(Client)
              // setFormValue();
              form.reset(Client);
          }, [Client && Client.clientid]);
      
      const onStateChange = (e: string) => {
          const st = State.getStateByCodeAndCountry(
            e,
            form.getValues("country_code")!
          )?.name;
        form.setValue("state_code",e);
        form.setValue("state", st!);
      };
    
      const onOwnerStateChange = (e: string) => {
        const st = State.getStateByCodeAndCountry(
          e,
          form.getValues("owner_country_code")!
        )?.name;
      form.setValue("owner_state_code", e);
      form.setValue("owner_state", st!);
    };
    

    useEffect(() => {
            setStates(State.getStatesOfCountry(form.getValues("country_code")));
          }, [form.watch("country_code")]);
        
          useEffect(() => {
            setCities(
              City.getCitiesOfState(
                form.getValues("country_code")!,
                form.getValues("state_code")!
              )
            );
          }, [form.watch("state_code")]);
        
          useEffect(() => {
            if (cities && cities.length > 0) {
              form.setValue("city", Client?.city!); 
            }
          }, [cities]);


  useEffect(() => {
    if (form.getValues("advocate_law_firm") === "A") fetchAdvdropdown();
    else fetchLfdropdownn();
    // console.log(form.getValues("advocate_law_firm"))
  }, [form.watch("advocate_law_firm")]);

  useEffect(() => {
    if (form.getValues("prev_advocate_law_firm") === "A") fetchprevAdvdropdown();
    else fetchprevLfdropdownn();
    // console.log(form.getValues("advocate_law_firm"))
  }, [form.watch("prev_advocate_law_firm")]);

  useEffect(() => {
    if (form.getValues("opposing_advocate_law_firm") === "A") fetchoppAdvdropdown();
    else fetchoppLfdropdownn();
    // console.log(form.getValues("advocate_law_firm"))
  }, [form.watch("opposing_advocate_law_firm")]);
  // const{data:case/:caseid} = useFetcher(
  //   `casemanagement/case/:caseid`,
  //   "appearingfordropdown"
  // );
  const onSuccess = (response: Case) => {
    const action = param["id"] ? " updated!" : "saved!";
    Toast.fire({
      icon: "success",
      title: `Case No. ${response.case_no} ${action} successfully!`,
    });
    router.push("/casemanagement/case");
  };


  const onError = () => {
    Toast.fire({
      icon: "error",
      title: "Submission Failed",
    });
  };
  const addCase = usePoster(
    "/case/case/add",
    "case",
    onSuccess,
    onError
  );

  const updateCase = useUpdater(
    `/case/case/update/${param["id"]}`,
    "casebyid",
    onSuccess,
    onError
  );

  const addClient = usePoster(
    "/contact/client/add", "clientList", 
    onSuccess, 
    onError);

    const onSubmit = (values: FormInputs) => {
      try {
          console.log(values);
          const currentDate = new Date(); // Get the current date in ISO format
         
          let data = { ...values };
  
          if (param["caseid"]) {
              // Updating existing law firm
              data = {
                  ...data,
                  companyid: Number(loggedincompanyid),
                  updatedby: Number(loggedinuserid),
                  updatedon: currentDate,
              };
              updateCase.mutate(data);
          } else {
              // Adding new law firm
              data = {
                  ...data,
                  companyid: Number(loggedincompanyid),
                  createdby: Number(loggedinuserid),
                  createdon: new Date(),
              };
              addCase.mutate(data);
          }
  
          console.log("getting lawfirm firmname lastname",data);
      } catch (error) {
          console.log(error);
      }
  };

    const onClientSubmit = (values: FormInputs) => {
      console.log(values);
      try {
          addClient.mutate(values); // ✅ Call the addClient API
      } catch (error) {
        console.log(error);
      }
    };


    

  const handleALRadioChange = (e: any) => {
    console.log(e.target.value);
    
    form.setValue("advocate_law_firm",e.target.value);
    if (e.target.value === "A") fetchAdvdropdown();
    else fetchLfdropdownn();
  };

  const handleprevALRadioChanged = (e: any) => {
    console.log(e.target.value);
    
    form.setValue("prev_advocate_law_firm",e.target.value);
    if (e.target.value === "A") fetchprevAdvdropdown();
    else fetchprevLfdropdownn();
  };

  const handleoppALRadioChanged = (e: any) => {
    console.log(e.target.value);
    
    form.setValue("opposing_advocate_law_firm",e.target.value);
    if (e.target.value === "A") fetchoppAdvdropdown();
    else fetchoppLfdropdownn();
  };

  // useEffect(() => {
  //   if(CaseType){
  //     form.reset(CaseType)
  //   }
  // }, [CaseType, form.reset]);


  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientDate, setNewClientDate] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");
  const [newClientState, setNewClientState] = useState("");
  const [newClientCountry, setNewClientCountry] = useState("");
  const [newClientCity, setNewClientCity] = useState("");
  const [newClientPincode, setNewPincode] = useState("");
  const [clients, setClients] = useState(clientdropdown || []);
  const [showAddButton, setShowAddButton] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [newClientType, setNewClientType] = useState("");
/////

  useEffect(() => {
    setClients(clientdropdown); // Ensure the previous data is retained
  }, [clientdropdown]);

  const handleAddClient = () => {
    if (
      newClientName?.trim() !== "" &&
      newClientDate?.trim() !== "" &&
      newClientAddress?.trim() !== "" &&
      newClientCountry?.trim() !== "" &&
      newClientState?.trim() !== "" &&
      newClientCity?.trim() !== "" &&
      newClientPincode?.trim() !== ""
    ) {
      const newClient = {
        clientid: clients.length + 1,
        clientname: newClientName,
      };
      setClients([...clients, newClient]);
      setIsDialogOpen(false);
  
      // Reset all input fields
      setNewClientName("");
      setNewClientDate("");
      setNewClientAddress("");
      setNewClientCountry("");
      setNewClientState("");
      setNewClientCity("");
      // setNewClientPincode(""); // ✅ Corrected setter function
    } else {
      alert("Please fill all fields!");
    }
  };
  

  const mode = param["id"] ? "edit" : "create";
  const isEditMode = mode === "edit";

  
  
  function setShowCasePopup(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  // new api
        useEffect(() => {
          setCities(
            City.getCitiesOfState(
              form.getValues("country_code")!,
              form.getValues("state_code")!
            )
          );
        }, [form.watch("state_code")]);
  
  // use effect
  
        useEffect(() => {
          // alert(1)
          setStates(State.getStatesOfCountry(form.getValues("country_code")));
        }, [form.watch("country_code")]);
  
        useEffect(() => {
          setOwnerStates(State.getStatesOfCountry(form.getValues("owner_country_code")));
        }, [form.watch("owner_country_code")]);
  
  // new api
        useEffect(() => {
          setOwnerCities(
            City.getCitiesOfState(
              form.getValues("owner_country_code")!,
              form.getValues("owner_state_code")!
            )
          );
        }, [form.watch("owner_state_code")]);
      
        useEffect(() => {
          if (cities && cities.length > 0) {
            form.setValue("city", Client?.city!); 
          }
        }, [cities]);
  
        useEffect(() => {
          if (Ownercities && Ownercities.length > 0) {
            form.setValue("owner_city", Client?.owner_city!); 
          }
        }, [Ownercities]);

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn("grid p-4 gap-4 md:grid-cols-2 px-5 pb-40", {
            "lg:w-3/4": !asDialog,
          })}
        >
         
         <div className="space-y-4">
  {/* Case Number Field */}
  <FormField
  control={form.control}
  name="case_no"
  rules={{
    validate: (value) =>
      value?.split("/").every((part) => part.trim() !== "") ||
      "*** Case Number is compulsory",
  }}
  render={({ field, fieldState }) => {
    const part1Ref = useRef<HTMLInputElement>(null);
    const part2Ref = useRef<HTMLInputElement>(null);
    const part3Ref = useRef<HTMLInputElement>(null);

    const splitParts = field.value?.split("/") || ["", "", ""];

    return (
      <FormItem>
        <div className="flex items-center gap-12">
          <FormLabel className={`w-32 ${fieldState.error ? "text-black" : ""}`}>
            Case No.<span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div className="flex gap-2">
              {/* First Part */}
              <Input
                ref={part1Ref}
                type="text"
                maxLength={6}
                placeholder="XXXXX"
                value={splitParts[0]}
                onChange={(e) => {
                  const input = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                  const parts = [...splitParts];
                  parts[0] = input;
                  field.onChange(parts.join("/"));
                  if (input.length === 6) {
                    part2Ref.current?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !splitParts[0]) {
                    e.preventDefault();
                  }
                }}
                readOnly={readOnly}
                className={`w-24 text-center ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <span className="mt-2">/</span>

              {/* Second Part */}
              <Input
                ref={part2Ref}
                type="text"
                maxLength={6}
                placeholder="YYYYYY"
                value={splitParts[1]}
                onChange={(e) => {
                  const input = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                  const parts = [...splitParts];
                  parts[1] = input;
                  field.onChange(parts.join("/"));
                  if (input.length === 6) {
                    part3Ref.current?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !splitParts[1]) {
                    part1Ref.current?.focus();
                    e.preventDefault();
                  }
                }}
                readOnly={readOnly}
                className={`w-24 text-center ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <span className="mt-2">/</span>

              {/* Third Part */}
              <Input
                ref={part3Ref}
                type="text"
                maxLength={6}
                placeholder="ZZZZZZ"
                value={splitParts[2]}
                onChange={(e) => {
                  const input = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                  const parts = [...splitParts];
                  parts[2] = input;
                  field.onChange(parts.join("/"));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !splitParts[2]) {
                    part2Ref.current?.focus();
                    e.preventDefault();
                  }
                }}
                readOnly={readOnly}
                className={`w-24 text-center ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </FormControl>
          {fieldState.error && (
            <span className="text-red-500 text-xs mt-1 ml-2 whitespace-nowrap inline-block">
              {fieldState.error.message}
            </span>
          )}
        </div>
      </FormItem>
    );
  }}
/>




  {/* Case Title Field */}
  <FormField
  control={form.control}
  name="case_title"
  rules={{ required: "*** Case Title is compulsory" }}
  render={({ field, fieldState }) => (
    <div className="flex items-start gap-x-12 w-[250%]">
      <FormLabel
          className={`w-32 ${fieldState.error ? "text-black" : ""}`}
        >
          Case Title<span className="text-red-500">*</span>
        </FormLabel>
      <FormControl>
        <div className="relative w-full">
          <textarea
            placeholder="Enter Case Title"
            {...field}
            maxLength={300}
            onChange={(e) => field.onChange(e.target.value.trimStart())}
            readOnly={readOnly}
            className={`w-full h-10 resize-none overflow-hidden rounded-md border border-gray-300 p-2 text-sm ${
              readOnly ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            rows={1}
            onInput={(e) => {
              e.currentTarget.style.height = "40px"; // Reset height to initial
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`; // Auto adjust height
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent new line on Enter
              }
            }}
          />
          {fieldState.error && (
            <span className="text-red-500 text-sm ml-2 mt-1 whitespace-nowrap">
              {fieldState.error.message}
            </span>
          )}
        </div>
      </FormControl>
    </div>
  )}
/>




  {/* Client Name Field with Add Client Button Beside */}
  
  <FormField
  control={form.control}
  name="clientid"
  render={({ field, fieldState }) => (
    <FormItem>
      <div className="flex items-center gap-12 relative">
        {/* Label */}
        <FormLabel
          className={`w-32 ${fieldState.error ? "text-black" : ""}`}
        >
          Client<span className="text-red-500">*</span>
        </FormLabel>

        {/* Select Input */}
        <FormControl>
          <div className="relative">
            <Select
              value={field.value?.toString() || "select"}
              name={field.name}
              onValueChange={field.onChange}
              disabled={readOnly}
            >
              <SelectTrigger
                className={`w-[500px] h-9 ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <SelectValue
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder="Select Client"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">{"< - - Select - - >"}</SelectItem>
                {clients?.map(({ clientname, clientid }: any, i: any) => (
                  <SelectItem
                    key={`${clientid}${i}`}
                    value={clientid?.toString()}
                  >
                    {clientname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Error message */}
            {fieldState.error && (
              <span className="text-red-500 text-sm ml-2 mt-1 whitespace-nowrap">
                {fieldState.error.message}
              </span>
            )}
          </div>
        </FormControl>

        <div className="flex items-center gap-2">
          {showAddButton && !showClientPopup && (
            <Button
              variant="outline"
              onClick={() => setShowClientPopup(true)}
              className="h-9 bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Client
            </Button>
          )}
        </div>

       
        
      </div>
    </FormItem>
  )}
/>











<div className="flex items-center gap-[58%] space-y-2">
  <FormField
  control={form.control}
  name="appearingforid"
  render={({ field }) => (
    <FormItem>
      <div className="flex items-center gap-12">
        <FormLabel className="text-sm w-32">Appearing For</FormLabel>
        <FormControl>
          <Select
            value={field.value?.toString() || "select"}
            name={field.name}
            onValueChange={field.onChange}
            disabled={readOnly}
          >
            <SelectTrigger
              className={`w-80 h-9 ${
                readOnly ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <SelectValue
                onBlur={field.onBlur}
                ref={field.ref}
                placeholder="Select Appearing for"
              />
            </SelectTrigger>
            <SelectContent>
              {/* Default option with a value that is not an empty string */}
              <SelectItem value="0">
                {"< - - Select - - >"}
              </SelectItem>
              {appearingfordropdown?.map(({ appearingfor, id }: any, i: any) => (
                <SelectItem key={`${id}${i}`} value={id?.toString()}>
                  {appearingfor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>


         

<FormField
  control={form.control}
  name="partyid"
  render={({ field }) => (
    <FormItem>
      <div className="flex items-center gap-12">
        <FormLabel className="w-32">Opponent Party </FormLabel>
        <FormControl>
          <Select
            value={field.value?.toString() || "select"}
            name={field.name}
            onValueChange={field.onChange}
            disabled={readOnly}
          >
            <SelectTrigger
              className={`w-80 h-9 ${
                readOnly ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <SelectValue
                onBlur={field.onBlur}
                ref={field.ref}
                placeholder="Select Opponent Party"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value = "0">
                {"< - - Select - - >"}
              </SelectItem>
              {partydropdown?.map(({ partyname, partyid }: any, i: any) => (
                <SelectItem key={`${partyid}${i}`} value={partyid?.toString()}>
                  {partyname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>


   </div>

  {/* Court Name Field */}
  <FormField
  control={form.control}
  name="courtid"
  rules={{ required: "*** Court Name is compulsory" }}
  render={({ field, fieldState }) => (
    <FormItem>
      <div className="flex items-center gap-8 relative">
        {/* Court Name Dropdown */}
        <div className="flex items-center gap-12 relative">
        <FormLabel
          className={`w-32 ${fieldState.error ? "text-black" : ""}`}
        >
          Court Name<span className="text-red-500">*</span>
        </FormLabel>
          <FormControl>
            <div className="relative">
              <Select
                value={field.value?.toString() || "select"}
                name={field.name}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Find the address, city, and pincode based on selected court ID
                  const selectedCourt = Courtaddress?.find(
                    (court: any) => court.id?.toString() === value
                  );
                  setSelectedCourtAddress(
                    selectedCourt
                      ? `${selectedCourt.address} - ${selectedCourt.pincode}`
                      : ""
                  );
                }}
                disabled={readOnly}
              >
                <SelectTrigger
                  className={`w-80 h-9 ${
                    readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <SelectValue
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder="Select Court Name"
                  />
                </SelectTrigger>
                <SelectContent>
                  {/* Default Option */}
                  <SelectItem value="select">{"< - - Select - - >"}</SelectItem>
                  {Courtaddress?.map(({ court_name, id }: any, i: any) => (
                    <SelectItem key={`${id}${i}`} value={id?.toString()}>
                      {court_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>

          {/* Error Message */}
          {fieldState.error && (
            <span className="text-red-500 text-sm ml-2 mt-1 whitespace-nowrap">
              {fieldState.error.message}
            </span>
          )}
        </div>

        {/* Display Selected Court Address if Available */}
        {selectedCourtAddress && (
          <h2 className="text-gray-700 font-bold overflow-visible whitespace-nowrap">
            {selectedCourtAddress}
          </h2>
        )}
      </div>
    </FormItem>
  )}
/>





<div className="flex items-center gap-[58%] space-y-2">
  {/* Judge Dropdown */}
  <FormField
    control={form.control}
    name="judgeid"
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center gap-12">
          <FormLabel className="text-sm w-32">Judge Name</FormLabel>
          <FormControl>
            <Select
              value={field.value?.toString()}
              name={field.name}
              onValueChange={field.onChange}
              disabled={readOnly}
            >
              <SelectTrigger
                className={`w-80 h-9 ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <SelectValue
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder="< - - Select  - - >"
                />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="0">
                  {"< - - Select  - - >"}
                </SelectItem>
                {judgedropdown?.map(({ judge_full_name, judgeid }: any, i: any) => (
                  <SelectItem key={`${judgeid}${i}`} value={judgeid?.toString()}>
                    {judge_full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </div>
      </FormItem>
    )}
  />

  {/* Last Judge Dropdown */}
  <FormField
    control={form.control}
    name="last_judge"
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center gap-12">
          <FormLabel className="text-sm w-32">Last Judge</FormLabel>
          <FormControl>
            <Select
              value={field.value?.toString()}
              name={field.name}
              onValueChange={field.onChange}
              disabled={readOnly}
            >
              <SelectTrigger
                className={`w-80 h-9 ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <SelectValue
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder="< - - Select - - >"
                />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="0">
                  {"< - - Select  - - >"}
                </SelectItem>
                {lastjudgedropdown?.map(({ judge_full_name, judgeid }: any, i: any) => (
                  <SelectItem key={`${judgeid}${i}`} value={judge_full_name?.toString()}>
                    {judge_full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </div>
      </FormItem>
    )}
  />
</div>



<div className="flex gap-[58%]">
<div className="flex flex-col gap-2">
  {/* Radio Button Section */}
  <div className="flex items-center gap-4">
    <FormLabel className="text-sm w-40">
      Advocate / Law Firm?<span className="text-red-500">*</span>
    </FormLabel>
    <FormField
      control={form.control}
      name="advocate_law_firm"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="advocate_law_firm"
                  value="A"
                  checked={field.value === "A"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue("advocate_law_firm_id", "");
                  }}
                  className="w-5 h-5 accent-blue-500"
                />
                Advocate
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="advocate_law_firm"
                  value="L"
                  checked={field.value === "L"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue("advocate_law_firm_id", "");
                  }}
                  className="w-5 h-5 accent-blue-500"
                />
                Law Firm
              </label>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  </div>

  {/* Dropdown Section */}
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-4">
      <FormLabel className="text-sm w-40" />
      <FormField
        control={form.control}
        name="advocate_law_firm_id"
        rules={{ required: "Please select an option" }}
        render={({ field, fieldState }) => (
          <FormItem className="w-80">
            <Select
              value={field.value?.toString()}
              name={field.name}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                className={`w-80 h-9 ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <SelectValue
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder={
                    form.getValues("advocate_law_firm") === "L"
                      ? "< - - Select Law Firm - - >"
                      : "< - - Select Advocate - - >"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="select" disabled>
                  {form.getValues("advocate_law_firm") === "A"
                    ? "< - - Select Advocate - - >"
                    : "< - - Select Law Firm - - >"}
                </SelectItem>

                {form.getValues("advocate_law_firm") === "A" ? (
                  advocate && advocate.length > 0 ? (
                    advocate.map((item: any) => (
                      <SelectItem
                        key={item.advocateid}
                        value={String(item.advocateid)}
                      >
                        {item.advocatename}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no_data">
                      No advocates available
                    </SelectItem>
                  )
                ) : lawfirm && lawfirm.length > 0 ? (
                  lawfirm.map((item: any) => (
                    <SelectItem
                      key={item.lawfirmid}
                      value={String(item.lawfirmid)}
                    >
                      {item.lawfirm_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no_data">
                    No Law Firm available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <span className="text-red-500 text-xs mt-1">
                {fieldState.error.message}
              </span>
            )}
          </FormItem>
        )}
      />
    </div>
  </div>
</div>

        



<div className="flex flex-col gap-2">
  {/* Label and Radio Buttons */}
  <div className="flex items-center gap-4">
    <FormLabel className="text-sm w-40">Opposing Advocate / Law Firm?</FormLabel>
    <FormField
      control={form.control}
      name="opposing_advocate_law_firm"
      defaultValue="N" // <-- This line sets "None" as default
      render={({ field }) => (

        <FormItem>
          <FormControl>
          <div className="flex gap-8 flex-nowrap">
              {/* Advocate */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="opposing_advocate_law_firm"
                  value="A"
                  checked={field.value === "A" || !field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue("opposing_advocate_law_firm_id", ""); // Reset dropdown
                  }}
                  className="w-5 h-5 accent-blue-500"
                />
                Advocate
              </label>

              {/* Law Firm */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="opposing_advocate_law_firm"
                  value="L"
                  checked={field.value === "L"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue("opposing_advocate_law_firm_id", ""); // Reset dropdown
                  }}
                  className="w-5 h-5 accent-blue-500"
                />
                Law Firm
              </label>

              {/* None */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="opposing_advocate_law_firm"
                  value="null"
                  checked={field.value === "N"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue("opposing_advocate_law_firm_id", ""); // Hide dropdown
                  }}
                  className="w-5 h-5 accent-blue-500"
                />
                None
              </label>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  </div>

  {/* Hide Dropdown if None is Selected */}
  {form.getValues("opposing_advocate_law_firm") !== "N" && (
    <div className="flex items-center gap-4">
      <FormLabel className="text-sm w-40"></FormLabel>
      <FormField
        control={form.control}
        name="opposing_advocate_law_firm_id"
        render={({ field }) => (
          <FormItem className="w-80">
            <Select
              value={field.value?.toString()}
              name={field.name}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                className={`w-full h-9 ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <SelectValue
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder={
                    form.getValues("opposing_advocate_law_firm") === "L"
                      ? "< - - Select Law Firm - - >"
                      : "< - - Select Advocate - - >"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">
                  {form.getValues("opposing_advocate_law_firm") === "A"
                    ? "< - - Select Advocate - - >"
                    : "< - - Select Law Firm - - >"}
                </SelectItem>
                {form.getValues("opposing_advocate_law_firm") === "A" ? (
                  oppadvocate && oppadvocate.length > 0 ? (
                    oppadvocate.map((item: any, i: number) => (
                      <SelectItem
                        key={`${item.advocateid}-${i}`}
                        value={String(item.advocateid)}
                      >
                        {item.advocatename}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no_data">
                      No advocates available
                    </SelectItem>
                  )
                ) : opplawfirm && opplawfirm.length > 0 ? (
                  opplawfirm.map((item: any, i: number) => (
                    <SelectItem
                      key={`${item.lawfirmid}-${i}`}
                      value={String(item.lawfirmid)}
                    >
                      {item.lawfirm_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no_data">
                    No Law Firm available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  )}
</div>
</div>

          <div className="flex gap-24">
          <div className="flex flex-col gap-4">
  {/* Label and Radio Buttons in a Single Line */}
  <div className="flex items-center gap-4">
    <FormLabel className="text-sm w-40">Prev Advocate / Law Firm?</FormLabel>
    <FormField
      control={form.control}
      name="prev_advocate_law_firm"
      defaultValue="N" // <-- This line sets "None" as default
      render={({ field }) => (
        <FormItem>
          <FormControl>
          <div className="flex gap-8 flex-nowrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="prev_advocate_law_firm"
                  value="A"
                  checked={field.value === "A" || !field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue("prev_advocate_law_firm_id", ""); // Reset dropdown
                  }}
                  className="w-5 h-5 accent-blue-500"
                />
                Advocate
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="prev_advocate_law_firm"
                  value="L"
                  checked={field.value === "L"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue("prev_advocate_law_firm_id", ""); // Reset dropdown
                  }}
                  className="w-5 h-5 accent-blue-500"
                />
                Law Firm
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="prev_advocate_law_firm"
                  value="N"
                  checked={field.value === "N"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue("prev_advocate_law_firm_id", ""); // Hide dropdown
                  }}
                  className="w-5 h-5 accent-blue-500"
                />
                None
              </label>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  </div>

  {/* Label and Dropdown in a Single Line */}
  {form.getValues("prev_advocate_law_firm") !== "N" && (
    <div className="flex items-center gap-4">
      <FormLabel className="text-sm w-40"> </FormLabel>
      <FormField
        control={form.control}
        name="prev_advocate_law_firm_id"
        render={({ field }) => (
          <FormItem className="w-80">
            <Select
              value={field.value?.toString()}
              name={field.name}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                className={`w-80 h-9 ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <SelectValue
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder={
                    form.getValues("prev_advocate_law_firm") === "L"
                      ? "< - - Select Law Firm - - >"
                      : "< - - Select Advocate - - >"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">
                  {form.getValues("prev_advocate_law_firm") === "A"
                    ? "< - - Select Advocate - - >"
                    : "< - - Select Law Firm - - >"}
                </SelectItem>
                {form.getValues("prev_advocate_law_firm") === "A" ? (
                  prevadvocate && prevadvocate.length > 0 ? (
                    prevadvocate.map((item: any, i: number) => (
                      <SelectItem
                        key={`${item.advocateid}-${i}`}
                        value={String(item.advocateid)}
                      >
                        {item.advocatename}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no_data">
                      No advocates available
                    </SelectItem>
                  )
                ) : prevlawfirm && prevlawfirm.length > 0 ? (
                  prevlawfirm.map((item: any, i: number) => (
                    <SelectItem
                      key={`${item.lawfirmid}-${i}`}
                      value={String(item.lawfirmid)}
                    >
                      {item.lawfirm_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no_data">
                    No Law Firm available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  )}
</div>



          <div className="ml-52">
          <FormField
            control={form.control}
            name="ref_advocate"
            render={({ field }) => (
              <FormItem className="flex items-center gap-28">
                <FormLabel className="text-sm whitespace-nowrap w-16">Reference Advocate</FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString()}
                    name={field.name}
                    onValueChange={field.onChange}
                    disabled={readOnly}
                  > 
                    <SelectTrigger
                      className={`w-80 h-9 ${
                        readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    >
                      <SelectValue
                        onBlur={field.onBlur}
                        ref={field.ref}
                        placeholder="< - - Select  - - >"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">
                        {"< - - Select - - >"}
                      </SelectItem>
                      {advocatedropdown &&
                        advocatedropdown.map(
                          ({ advocatename, advocateid }: any, i: any) => (
                            <SelectItem
                              key={`${advocateid}${i}`}
                              value={advocateid?.toString()}
                            >
                              {advocatename}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
</div>
{/* 
<div className="flex gap-8 w-full"> */}
  {/* Case Notes */}
  <div className="flex items-start gap-x-4 w-[250%]">
  <div className="flex items-start gap-x-12 relative w-[250%]">
  <FormLabel className="text-sm w-32">
    Case Notes <span className="text-red-500">*</span>
  </FormLabel>
  <FormField
    control={form.control}
    name="case_notes"
    rules={{ required: "*** Case Notes are compulsory" }}
    render={({ field, fieldState }) => (
      <div className="relative w-full">
        <FormControl>
          <Textarea
            placeholder="Enter Case Notes"
            {...field}
            readOnly={readOnly}
            onChange={(e) => field.onChange(e.target.value.trimStart())}
            className={`w-full h-80 resize-none border rounded-md p-2 ${
              readOnly ? "bg-gray-100 cursor-not-allowed" : ""
            } `}
            maxLength={5000}
          />
        </FormControl>
        {fieldState.error && (
          <span className="text-red-500 text-sm ml-2 mt-1 whitespace-nowrap">
            {fieldState.error.message}
          </span>
        )}
      </div>
    )}
  />
</div>

  </div>

  {/* Other Info */}
  <div className="flex items-start gap-x-12 w-[250%]">
    <FormLabel className="text-sm w-32">Other Info</FormLabel>
    <FormField
      control={form.control}
      name="other_info"
      render={({ field }) => (
        <FormControl>
          <Textarea
            placeholder="Enter Other Info"
            {...field}
            readOnly={readOnly}
            onChange={(e) => field.onChange(e.target.value.trimStart())}
            className={`w-full h-80 resize-none ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            maxLength={5000}
          />
        </FormControl>
      )}
    />
  </div>
{/* </div> */}



  {/* Case Status Dropdown */}
  <div className="flex items-center gap-12 w-50"> 
  <FormField
  control={form.control}
  name="statusid"
  rules={{
    required: "*** Status is mandatory",
  }}
  render={({ field, fieldState }) => (
    <FormItem>
      <div className="flex items-center gap-8">
        <FormLabel
          className={`w-32 ${fieldState.error ? "text-black" : ""}`}
        >
          Status <span className="text-red-500">*</span>
        </FormLabel>
        <FormControl>
          <Select
            value={
              field.value?.toString() ||
              statusdropdown?.find((item: any) => item.status_name === "New")
                ?.id?.toString() ||
              "select" // Default to placeholder value
            }
            onValueChange={(value) =>
              field.onChange(value !== "select" ? Number(value) : undefined)
            }
            disabled={readOnly} // Disable if readOnly is true
          >
            <SelectTrigger
              className={`w-60 h-10 ${
                readOnly ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <SelectValue
                onBlur={field.onBlur}
                ref={field.ref}
                placeholder="< - - Select - - >"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select">
                {"< - - Select - - >"}
              </SelectItem>
              {statusdropdown &&
                statusdropdown.map(({ status_name, id }: any, i: any) => (
                  <SelectItem key={`${id}${i}`} value={id?.toString()}>
                    {status_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormControl>
      </div>
      {fieldState.error && (
        <FormMessage className="text-red-500 ml-32">
          {fieldState.error.message}
        </FormMessage>
      )}
    </FormItem>
  )}
/>




  </div>

  {/* Status Remarks Input */}
  <div className="flex items-center gap-12 w-[70%]">
  <FormField
    control={form.control}
    name="status_remarks"
    rules={{ required: "Status Remarks is compulsory" }}
    render={({ field, fieldState }) => (
      <div className="flex flex-col items-start space-y-1">
        <div className="flex items-start space-x-4">
          <FormLabel
            className={`text-sm w-32 ${fieldState.error ? "text-black" : ""}`}
          >
            Status Remarks <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <textarea
              placeholder="Enter Status Remarks"
              {...field}
              readOnly={readOnly}
              onChange={(e) => field.onChange(e.target.value.trimStart())}
              className={`w-[1150px] h-10 resize-none overflow-hidden rounded-md border border-gray-300 p-2 text-sm ${
                readOnly ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              maxLength={5000}
              rows={1}
              onInput={(e) => {
                e.currentTarget.style.height = "40px"; // Reset height
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`; // Auto expand
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent Enter key from adding new line
                }
              }}
            />
          </FormControl>
        </div>
        {fieldState.error && (
          <span className="text-red-500 text-xs mt-1 ml-[135px]">
            {fieldState.error.message}
          </span>
        )}
      </div>
    )}
  />
</div>



  <>
  {/* Other fields here */}

  {/* {isEditMode && (
  <div className="flex flex-col items-start gap-8 mt-4 w-[60%]">
    <div className="flex items-center gap-8">
      
      <FormField
        control={form.control}
        name="next_hearing_date"
        render={({ field }) => (
          <div className="flex items-center gap-4">
            <FormLabel className="text-sm w-40 whitespace-nowrap">
              Next Hearing Date:
            </FormLabel>
            <FormControl>
              <input
                type="date"
                value={
                  field.value
                    ? typeof field.value === "string"
                      ? field.value
                      : new Date(field.value).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  field.onChange(e.target.value || undefined)
                }
                className={`w-60 h-9 border rounded px-2 ${
                  readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </FormControl>
          </div>
        )}
      />

 
      <FormField
        control={form.control}
        name="next_hearing_at"
        render={({ field }) => (
          <div className="flex items-center gap-0">
            <FormLabel className="text-sm w-40 whitespace-nowrap">
              Next Hearing At 
            </FormLabel>
            <FormControl>
              <Select
                value={field.value?.toString()}
                name={field.name}
                onValueChange={field.onChange}
                disabled={readOnly}
              >
                <SelectTrigger
                  className={`w-64 h-9 ${
                    readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <SelectValue
                    onBlur={field.onBlur}
                    ref={field.ref}
                    placeholder="Select Court Name"
                  />
                </SelectTrigger>
                <SelectContent>
                  {nextcourtdropdown &&
                    nextcourtdropdown.map(({ court_name, id }: any, i: any) => (
                      <SelectItem key={`${id}${i}`} value={id?.toString()}>
                        {court_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
          </div>
        )}
      />
    </div>
  </div>
)} */}
</>




</div>


  
  </div>
        


        {!readOnly && (
          <FormFooter fixed={!asDialog}>
            <Button type="submit" variant="primary">
              Save
            </Button>


            <Button
              type="button"
              className="border-red-500"
              onClick={() => router.push("/casemanagement/case")}
              variant="outline"
            >
              Cancel
            </Button>
          </FormFooter>
        )}

        {readOnly && (
          <div className="flex justify-end px-6 pb-6">
            <FormFooter fixed={!asDialog}>
              <Button
                type="button"
                className="border-red-500"
                onClick={() => router.push("/casemanagement/case")}
                variant="outline"
              >
                Close
              </Button>
            </FormFooter>
          </div>
        )}
      </form>
    </Form>
    {showClientPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
       <div className="bg-white rounded-lg p-6 w-[1000px] h-[700px] shadow-lg overflow-auto">

          <h2 className="text-lg font-bold mb-4">Add New Client</h2>

          <ClientForm asDialog={true} />  
           
        </div>
      </div>
    )}
    </>
  );
};

export default CaseForm;
