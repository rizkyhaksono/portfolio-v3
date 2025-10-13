import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FolderX } from "lucide-react";
import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="max-w-2xl mx-auto mt-20">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-6">
              <FolderX className="size-16 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Project Not Found</CardTitle>
          <CardDescription className="text-base">
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/project">
            <Button className="gap-2">
              <ArrowLeft className="size-4" />
              Back to Projects
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
