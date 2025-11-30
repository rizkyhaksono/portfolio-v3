import BlurFade from "@/components/magicui/blur-fade";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { getLinkedinCertifications } from "@/services/visitor/linkedin";
import { CertificationCard } from "@/app/_components/certification/certification-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CertificatesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CertificatesPage({ searchParams }: CertificatesPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const limit = 10;

  let certifications: any[] = [];
  let totalPages = 1;
  let total = 0;

  try {
    const response = await getLinkedinCertifications(currentPage, limit);
    certifications = response.data || [];
    totalPages = response.totalPages || 1;
    total = response.total || 0;
  } catch (error) {
    console.error("Failed to fetch certifications:", error);
  }

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <BlurFade delay={0.25} inView>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-base font-bold">Certifications</h1>
          <p className="text-muted-foreground text-sm">
            {total} professional certifications and completed courses
          </p>
        </div>

        {/* Certifications Grid - Compact */}
        {certifications.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <CertificationCard key={cert.id} certification={cert} compact={true} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <Link
                  href={`/certificates?page=${currentPage - 1}`}
                  className={!hasPrevPage ? "pointer-events-none opacity-50" : ""}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasPrevPage}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <Link
                  href={`/certificates?page=${currentPage + 1}`}
                  className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNextPage}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No certifications found</p>
          </div>
        )}
      </div>
    </BlurFade>
  );
}

