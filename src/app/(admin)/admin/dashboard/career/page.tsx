"use client";

import { supabaseUser } from "@/lib/supabase/server";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File, ListFilter, Info } from "lucide-react";

export default function AdminDashboardCareerPage() {
  const [careerData, setCareerData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCareer = async () => {
      setIsLoading(true);
      const { data, error } = await supabaseUser.from("career").select("*");
      if (error) {
        console.log(error);
      } else {
        setCareerData(data);
      }
      setIsLoading(false);
    };
    fetchCareer();
  }, []);

  console.log(careerData);

  if (isLoading) {
    return (
      <div className="">
        <div className="flex flex-col sm:gap-4 sm:py-1 sm:pl-14 m-4">
          Admin Dashboard Career Page
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col sm:gap-4 sm:py-1 sm:pl-14 m-4">
        Admin Dashboard Career Page
        <Tabs defaultValue="allData">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="allData">All Data</TabsTrigger>
              <TabsTrigger value="insertData">Insert Data</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>Fulfilled</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Export</span>
              </Button>
            </div>
          </div>
          <TabsContent value="allData">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Career</CardTitle>
                <CardDescription>Recent career from your experience.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden sm:table-cell">Subtitle</TableHead>
                      <TableHead className="hidden sm:table-cell">Duration</TableHead>
                      <TableHead className="hidden md:table-cell">Created At</TableHead>
                      <TableHead className="text-left">Updated At</TableHead>
                      <TableHead className="text-left">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  {careerData.map((career: any) => (
                    <TableBody key={career.id}>
                      <TableRow>
                        <TableCell className="hidden sm:table-cell">{career.id}</TableCell>
                        <TableCell>{career.title}</TableCell>
                        <TableCell className="hidden sm:table-cell">{career.subtitle}</TableCell>
                        <TableCell className="hidden sm:table-cell">{career.duration}</TableCell>
                        <TableCell className="hidden md:table-cell">{career.created_at}</TableCell>
                        <TableCell className="text-left">{career.updated_at}</TableCell>
                        <TableCell className="text-left">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Info className="h-5 w-5" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="insertData">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Insert Data</CardTitle>
                <CardDescription>Insert career from your experience.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden sm:table-cell">Subtitle</TableHead>
                      <TableHead className="hidden sm:table-cell">Duration</TableHead>
                      <TableHead className="hidden md:table-cell">Created At</TableHead>
                      <TableHead className="text-left">Updated At</TableHead>
                      <TableHead className="text-left">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  {careerData.map((career: any) => (
                    <TableBody key={career.id}>
                      <TableRow>
                        <TableCell className="hidden sm:table-cell">{career.id}</TableCell>
                        <TableCell>{career.title}</TableCell>
                        <TableCell className="hidden sm:table-cell">{career.subtitle}</TableCell>
                        <TableCell className="hidden sm:table-cell">{career.duration}</TableCell>
                        <TableCell className="hidden md:table-cell">{career.created_at}</TableCell>
                        <TableCell className="text-right">{career.updated_at}</TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
