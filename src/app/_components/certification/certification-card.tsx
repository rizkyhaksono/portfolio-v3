"use client"

import { LinkedinCertification } from "@/commons/types/linkedin"
import { Card, CardContent } from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import { ExternalLink, Award } from "lucide-react"
import Image from "next/image"

interface CertificationCardProps {
  certification: LinkedinCertification
  compact?: boolean
}

export function CertificationCard({ certification, compact = false }: Readonly<CertificationCardProps>) {
  if (compact) {
    return (
      <Card className="hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex gap-3 items-start">
            {/* Small Logo */}
            {certification.image ? (
              <div className="flex-shrink-0">
                <Image
                  src={certification.image}
                  alt={certification.provider}
                  width={40}
                  height={40}
                  className="rounded object-contain"
                  unoptimized // LinkedIn images require unoptimized to avoid 403
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
            )}

            {/* Compact Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-sm mb-0.5 line-clamp-2">{certification.title}</h3>
              <p className="text-xs text-muted-foreground">{certification.provider}</p>
              <div className="mt-1.5">
                <Chip>{certification.issuedDisplay}</Chip>
              </div>
            </div>

            {/* Link Icon */}
            {certification.link && (
              <a href={certification.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors" aria-label="View credential">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Full version for dedicated page
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {certification.image ? (
            <div className="flex-shrink-0">
              <Image
                src={certification.image}
                alt={certification.provider}
                width={64}
                height={64}
                className="rounded-lg object-contain"
                unoptimized // LinkedIn images require unoptimized to avoid 403
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <Award className="w-8 h-8 text-primary" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg mb-1 line-clamp-2">{certification.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{certification.provider}</p>
            <div>
              <Chip>Issued · {certification.issuedDisplay}</Chip>
            </div>

            {certification.link && (
              <a href={certification.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                <span>View Credential</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
