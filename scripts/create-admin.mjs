// Cria (ou promove) um administrador do painel. Usa a chave de serviço do Supabase,
// que nunca vai para o navegador. Uso: node --env-file=.env scripts/create-admin.mjs <email> <senha>
import { createClient } from '@supabase/supabase-js';

const [email, password] = process.argv.slice(2);
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(message) {
  console.error(`Erro: ${message}`);
  process.exit(1);
}

if (!supabaseUrl || !serviceRoleKey) fail('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar no arquivo .env.');
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('informe um e-mail válido.');
if (!password || password.length < 8) fail('a senha deve ter pelo menos 8 caracteres.');

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserIdByEmail(targetEmail) {
  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === targetEmail.toLowerCase());
    if (match) return match.id;
    if (data.users.length < 200) return null;
  }
  return null;
}

try {
  let userId = await findUserIdByEmail(email);

  if (userId) {
    const { error } = await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
    if (error) throw error;
    console.log('Conta já existente: senha atualizada.');
  } else {
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    userId = data.user.id;
    console.log('Conta criada.');
  }

  const { error: adminError } = await admin.from('admins').upsert({ user_id: userId }, { onConflict: 'user_id' });
  if (adminError) throw adminError;

  console.log(`Administrador configurado com sucesso: ${email}`);
} catch (err) {
  fail(err instanceof Error ? err.message : 'não foi possível concluir a configuração.');
}
