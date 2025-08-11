-- Crear tabla de edificios
CREATE TABLE IF NOT EXISTS public.buildings (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    comuna TEXT NOT NULL,
    address TEXT NOT NULL,
    amenities TEXT[] DEFAULT '{}',
    gallery TEXT[] DEFAULT '{}',
    cover_image TEXT,
    badges JSONB DEFAULT '[]',
    service_level TEXT CHECK (service_level IN ('pro', 'standard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de unidades
CREATE TABLE IF NOT EXISTS public.units (
    id TEXT PRIMARY KEY,
    building_id TEXT NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
    tipologia TEXT NOT NULL,
    m2 INTEGER,
    price INTEGER NOT NULL,
    estacionamiento BOOLEAN DEFAULT FALSE,
    bodega BOOLEAN DEFAULT FALSE,
    disponible BOOLEAN DEFAULT TRUE,
    bedrooms INTEGER,
    bathrooms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_buildings_comuna ON public.buildings(comuna);
CREATE INDEX IF NOT EXISTS idx_buildings_slug ON public.buildings(slug);
CREATE INDEX IF NOT EXISTS idx_units_building_id ON public.units(building_id);
CREATE INDEX IF NOT EXISTS idx_units_disponible ON public.units(disponible);
CREATE INDEX IF NOT EXISTS idx_units_price ON public.units(price);
CREATE INDEX IF NOT EXISTS idx_units_tipologia ON public.units(tipologia);

-- Crear vista para filtros disponibles
CREATE OR REPLACE VIEW public.v_filters_available AS
SELECT DISTINCT
    b.comuna,
    u.tipologia
FROM public.buildings b
JOIN public.units u ON b.id = u.building_id
WHERE u.disponible = true;

-- Configurar RLS (Row Level Security)
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública
CREATE POLICY "Allow public read access to buildings" ON public.buildings
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to units" ON public.units
    FOR SELECT USING (true);

-- Políticas para escritura (solo service role)
CREATE POLICY "Allow service role full access to buildings" ON public.buildings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to units" ON public.units
    FOR ALL USING (auth.role() = 'service_role');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_buildings_updated_at 
    BEFORE UPDATE ON public.buildings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at 
    BEFORE UPDATE ON public.units 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
