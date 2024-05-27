"use client";

import { supabaseUser } from "@/lib/supabase/server";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File, ListFilter, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function AdminDashboardProjectPage() {
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      const { data, error } = await supabaseUser.from("projects").select("*");
      if (error) {
        console.log(error);
      }
      setProjectData(data);
      setIsLoading(false);
    };
    fetchProjectData();
  }, []);

  console.log(projectData);

  if (isLoading) {
    return (
      <div className="flex flex-col sm:gap-4 sm:py-1 sm:pl-14 m-4">
        Admin Dashboard Project Page
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:gap-4 sm:py-1 sm:pl-14 m-4">
      Admin Dashboard Project Page
      <Tabs defaultValue="allData" className="max-[644px]:mt-4">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="allData">All Data</TabsTrigger>
            <TabsTrigger value="insertData">Insert Data</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="allData">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Project</CardTitle>
              <CardDescription>Recent project from your experience.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
