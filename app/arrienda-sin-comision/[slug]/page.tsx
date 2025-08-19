interface BuildingDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BuildingDetailPage({ params }: BuildingDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">Edificio: {slug}</h1>
      <p className="text-lg text-muted-foreground">
        Página de detalle del edificio
      </p>
      <p className="mt-4">Slug recibido: {slug}</p>
    </div>
  );
}
