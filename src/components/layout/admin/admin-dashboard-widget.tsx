"use client";

import { ChevronLeft, ChevronRight, Copy, CreditCard, MoreVertical, Truck, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "../../ui/skeleton";
import { supabaseUser } from "@/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

export default function AdminDashboardWidget() {
  const [isLoading, setIsLoading] = useState(true);
  const [careerData, setCareerData] = useState<any>([]);
  const [projectData, setProjectData] = useState<any>([]);

  const formSchema = z.object({
    titleCareer: z.string().min(2).max(50),
    description: z.string().min(2).max(50),
    url: z.string().min(2).max(50),
    titleProject: z.string().min(2).max(50),
    subtitle: z.string().min(2).max(50),
    duration: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleCareer: "",
      description: "",
      url: "",
      titleProject: "",
      subtitle: "",
      duration: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  useEffect(() => {
    const fetchCareer = async () => {
      const { data, error } = await supabaseUser.from("career").select("*");
      if (error) {
        console.log(error);
      } else {
        setCareerData(data);
        setIsLoading(false);
      }
    };

    const fetchProject = async () => {
      const { data, error } = await supabaseUser.from("projects").select("*");
      if (error) {
        console.log(error);
      } else {
        setProjectData(data);
        setIsLoading(false);
      }
    };

    fetchCareer();
    fetchProject();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col sm:gap-4 sm:py-1 sm:pl-14 m-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/12" />
          <div className="flex justify-between items-center space-x-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:gap-4 sm:py-1 sm:pl-14 m-4">
      <main className="grid flex-1 items-start md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Rizky Haksono Admin Dashboard</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">{"Welcome back, Rizky! Here's what's happening with your store today"}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={"/admin/dashboard/project"}>
                  <Button>Add new project</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>All Data Career</CardDescription>
                <CardTitle className="text-4xl">{careerData.length} Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">+25% from last week</div>
              </CardContent>
              <CardFooter>
                <Progress value={careerData.length} aria-label="25% increase" />
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>All Data Project</CardDescription>
                <CardTitle className="text-4xl">{projectData.length} Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">+10% from last month</div>
              </CardContent>
              <CardFooter>
                <Progress value={projectData.length} aria-label="12% increase" />
              </CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="career">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="career">Career</TabsTrigger>
                <TabsTrigger value="project">Project</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="career">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>Recent orders from your store.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden lg:table-cell">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    {projectData.map((project: any) => (
                      <TableBody key={project.id}>
                        <TableRow>
                          <TableCell>{project.id}</TableCell>
                          <TableCell>{project.title}</TableCell>
                          <TableCell>{project.description}</TableCell>
                          <TableCell>
                            <Link href={project.url} target="_blank">
                              {project.url}
                            </Link>
                          </TableCell>
                          <TableCell>{project.image === null ? "-" : <Image src={project.image} width={500} height={500} alt="Project Image" />}</TableCell>
                          <TableCell className="flex gap-2">
                            <Dialog>
                              <DialogTrigger
                                asChild
                                onClick={() => {
                                  console.log(project.id);
                                }}
                              >
                                <Button variant="outline" size="icon">
                                  <Pencil className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit {project.title}</DialogTitle>
                                  <DialogDescription>{project.description}</DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                      control={form.control}
                                      name="titleCareer"
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
                                      name="description"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Description</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Your career description" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="url"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>URL</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Your career url" {...field} />
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
                                  console.log(project.id);
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
            <TabsContent value="project">
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
                                      name="titleProject"
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
          </Tabs>
        </div>
        <div>
          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Order Oe31b70H
                  <Button size="icon" variant="outline" className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription>Date: November 23, 2023</CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">Track Order</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Trash</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Glimmer Lamps x <span>2</span>
                    </span>
                    <span>$250.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Aqua Filters x <span>1</span>
                    </span>
                    <span>$49.00</span>
                  </li>
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>$299.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$5.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$25.00</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>$329.00</span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <div className="font-semibold">Shipping Information</div>
                  <address className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>Liam Johnson</span>
                    <span>1234 Main St.</span>
                    <span>Anytown, CA 12345</span>
                  </address>
                </div>
                <div className="grid auto-rows-max gap-3">
                  <div className="font-semibold">Billing Information</div>
                  <div className="text-muted-foreground">Same as shipping address</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Customer Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Customer</dt>
                    <dd>Liam Johnson</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>
                      <a href="mailto:">liam@acme.com</a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      <a href="tel:">+1 234 567 890</a>
                    </dd>
                  </div>
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Visa
                    </dt>
                    <dd>**** **** **** 4532</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated <time dateTime="2023-11-23">November 23, 2023</time>
              </div>
              <Pagination className="ml-auto mr-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6">
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">Previous Order</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6">
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Next Order</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
