"use client";

import { useState } from "react";
import type { Service } from "@prisma/client";
import ServiceCard from "./ServiceCard";
import RequestPdfModal from "./RequestPdfModal";

export default function ServiciosDestacadosClient({ destacados }: { destacados: Service[] }) {
  const [selectedPdfService, setSelectedPdfService] = useState<Service | null>(null);

  return (
    <>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {destacados.map((service, i) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={i}
            onRequestPdf={(srv) => setSelectedPdfService(srv)}
          />
        ))}
      </div>

      <RequestPdfModal
        service={selectedPdfService}
        isOpen={Boolean(selectedPdfService)}
        onClose={() => setSelectedPdfService(null)}
      />
    </>
  );
}
