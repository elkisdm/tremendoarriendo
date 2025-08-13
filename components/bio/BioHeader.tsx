// import Image from "next/image";

interface BioHeaderProps {
  name?: string;
  subtitle?: string;
}

export function BioHeader({ 
  name = "Elkis Daza", 
  subtitle = "Realtor • Opciones con beneficios" 
}: BioHeaderProps) {
  const benefits = [
    "Opciones sin comisión",
    "Opciones sin garantía", 
    "Opciones sin aval",
    "Pet friendly",
    "3000+ opciones"
  ];

  return (
    <header className="text-center space-y-6">
      {/* Avatar */}
      <div className="flex justify-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-primary/20">
          {/* TODO: Reemplazar con foto real y optimizar para OG */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
            <span className="text-2xl font-bold text-primary">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
      </div>

      {/* Nombre y subtítulo */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          {name}
        </h1>
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {/* Badges de beneficios */}
      <div className="space-y-3">
        <ul 
          className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto"
          role="list"
          aria-label="Beneficios disponibles"
        >
          {benefits.map((benefit, index) => (
            <li key={index}>
              <span 
                className="inline-block px-3 py-2 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20 min-h-[44px] flex items-center justify-center"
                role="presentation"
              >
                {benefit}
              </span>
            </li>
          ))}
        </ul>
        
        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Beneficios sujetos a disponibilidad y evaluación.
        </p>
      </div>
    </header>
  );
}
