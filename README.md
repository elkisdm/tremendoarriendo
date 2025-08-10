## Ingesta y métricas (Supabase)

- Histórico en tiempo real vía trigger en `public.units_history`.
- Snapshot diario en `public.units_snapshot_daily` y `public.buildings_snapshot_daily`.
- Corridas de ingesta con métricas en `public.ingest_runs`.
- Señales de mercado:
  - `public.mv_price_drops_7d`: caída de precio ≥5% en 7 días.
  - `public.mv_new_listings_24h`: nuevas altas en 24h.
- Vistas de lectura directa:
  - `public.v_filters_available`, `public.v_exports_units_delta`.
- Retención: purga de `units_history` > 180 días.

### Script de ingesta

Variables requeridas:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Instala y ejecuta:
```bash
pnpm add @supabase/supabase-js
pnpm run ingest:assetplan
```

El script:
- Upserta `buildings`/`units` con provider `assetplan`.
- Soft-delete si falta en feed o `precio <= 1`.
- Actualiza `ingest_runs.*` (start/finish + contadores).
- Llama: `refresh_building_aggregates()`, `take_daily_snapshots(current_date)`,
  `refresh_market_views()`, `purge_units_history(180)`.

### Consultas de validación

```sql
select * from public.v_filters_available order by type, units desc;
select * from public.mv_price_drops_7d order by pct_drop desc limit 20;
select * from public.mv_new_listings_24h order by first_seen_available desc limit 20;
```

Rotación semanal por comuna:
```sql
select b.comuna,
       count(*) filter (where h.op='soft_delete' and h.changed_at>=now()-interval '7 days') as salieron,
       count(*) filter (where (h.new_state->>'disponible')::boolean = true and h.changed_at>=now()-interval '7 days') as entraron
from public.units_history h
join public.units u on u.id=h.unit_id
join public.buildings b on b.id=u.building_id
group by b.comuna
order by salieron desc;
```

Conversión 30 días:
```sql
select b.nombre,
       count(distinct l.id) as leads,
       count(distinct k.id) as bookings,
       round(100.0*count(distinct k.id)/nullif(count(distinct l.id),0),2) as conversion_pct
from public.leads l
left join public.bookings k on k.building_id=l.building_id and k.created_at >= now() - interval '30 days'
join public.buildings b on b.id=l.building_id
where l.created_at >= now() - interval '30 days'
group by b.nombre
order by conversion_pct desc nulls last;
```

### Acceso read-only externo

Concede SELECT solo a:
`units_snapshot_daily`, `buildings_snapshot_daily`, `mv_price_drops_7d`,
`mv_new_listings_24h`, `v_exports_units_delta`, `v_filters_available`.
No conceder acceso a `leads`/`bookings` (PII).


