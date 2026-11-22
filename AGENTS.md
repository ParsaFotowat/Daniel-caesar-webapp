- Keep showroom content in `src/lib/catalog.ts` and render it through shared components so English and Persian routes stay synchronized.
  Why: product specifications and translations must remain consistent across browsing and detail views.
- Build rich watch demonstrations as shared components backed by catalog detail fields.
  Why: homepage and product-detail presentations must describe each timepiece consistently.
- Database changes go in a new file in `supabase/migrations/` (never edit an applied one); keep `src/integrations/supabase/types.ts` in sync.
  Why: the production database is updated by running these files in order.
