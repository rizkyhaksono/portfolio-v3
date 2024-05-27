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

export default function AdminDashboardCareerPage() {
  const [careerData, setCareerData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formSchema = z.object({
    title: z.string().min(2).max(50),
    subtitle: z.string().min(2).max(50),
    duration: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      duration: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  useEffect(() => {
    const fetchCareer = async () => {
      setIsLoading(true);
      const { data, error } = await supabaseUser.from("career").select("*");
      if (error) {
        console.log(error);
      } else {
        setCareerData(data);
        setIsLoading(false);
      }
    };
    fetchCareer();
  }, []);

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
    <div className="flex flex-col sm:gap-4 sm:py-1 sm:pl-14 m-4">
      Admin Dashboard Career Page
      <Tabs defaultValue="allData" className="max-[644px]:mt-4">
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
                    <TableHead className="hidden lg:table-cell">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Subtitle</TableHead>
                    <TableHead className="">Duration</TableHead>
                    <TableHead className="hidden md:table-cell">Created At</TableHead>
                    <TableHead className="text-left hidden md:table-cell">Updated At</TableHead>
                    <TableHead className="text-left">Action</TableHead>
                  </TableRow>
                </TableHeader>
                {careerData.map((career: any) => (
                  <TableBody key={career.id}>
                    <TableRow>
                      <TableCell className="hidden lg:table-cell">{career.id}</TableCell>
                      <TableCell>{career.title}</TableCell>
                      <TableCell className="hidden sm:table-cell">{career.subtitle}</TableCell>
                      <TableCell className="">{career.duration}</TableCell>
                      <TableCell className="hidden md:table-cell">{career.created_at}</TableCell>
                      <TableCell className="text-left hidden md:table-cell">{career.updated_at}</TableCell>
                      <TableCell className="text-left space-x-2 flex">
                        <Dialog>
                          <DialogTrigger
                            asChild
                            onClick={() => {
                              console.log(career.id);
                            }}
                          >
                            <Button variant="outline" size="icon">
                              <Pencil className="h-5 w-5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit {career.title}</DialogTitle>
                              <DialogDescription>
                                {career.subtitle} | {career.duration}
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Title</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Your career title" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="subtitle"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Subtitle</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Your career subtitle" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="duration"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Duration</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Your career duration" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit">Submit</Button>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger
                            onClick={() => {
                              console.log(career.id);
                            }}
                          >
                            <Button variant="outline" size="icon">
                              <Trash className="h-5 w-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Your career title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input placeholder="Your career subtitle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="Your career duration" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
