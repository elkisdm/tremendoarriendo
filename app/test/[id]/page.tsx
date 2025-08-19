interface TestPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TestPage({ params }: TestPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">Test ID: {id}</h1>
      <p className="text-lg text-muted-foreground">
        Página de prueba dinámica
      </p>
    </div>
  );
}
