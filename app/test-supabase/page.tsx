import { createSupabaseClient } from '@/lib/supabase/client'

export default async function TestSupabasePage() {
  const supabase = createSupabaseClient()
  const { error } = await supabase.from('_health_check').select('*').limit(1)

  return (
    <main className="p-8 font-mono">
      <h1 className="text-2xl mb-4">Test Supabase</h1>
      {error ? (
        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
      ) : (
        <p>Connexion OK</p>
      )}
    </main>
  )
}
