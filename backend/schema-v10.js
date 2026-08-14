export const SCHEMA_V10 = [
`PRAGMA foreign_keys = ON`,
`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, email_verified INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS password_resets (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, used_at TEXT, created_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS artist_profiles (id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, artist_name TEXT, artist_url TEXT, ad_code TEXT, artist_image TEXT, metadata_json TEXT, updated_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS connections (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, provider TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'disconnected', access_token_enc TEXT, refresh_token_enc TEXT, expires_at TEXT, scopes TEXT, provider_account TEXT, updated_at TEXT NOT NULL, UNIQUE(user_id, provider))`,
`CREATE TABLE IF NOT EXISTS oauth_states (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, provider TEXT NOT NULL, state_hash TEXT NOT NULL UNIQUE, code_verifier TEXT NOT NULL, redirect_uri TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS drafts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, mode TEXT NOT NULL, payload_json TEXT NOT NULL, updated_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS publications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, mode TEXT NOT NULL, track_title TEXT NOT NULL, artist_name TEXT, status TEXT NOT NULL, payload_json TEXT NOT NULL, published_at TEXT, created_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS publication_log (id TEXT PRIMARY KEY, publication_id TEXT NOT NULL REFERENCES publications(id) ON DELETE CASCADE, channel TEXT NOT NULL, status TEXT NOT NULL, external_id TEXT, message TEXT, created_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS tracking_events (id TEXT PRIMARY KEY, publication_id TEXT REFERENCES publications(id) ON DELETE SET NULL, event_type TEXT NOT NULL, source TEXT, country TEXT, device TEXT, anon_fingerprint TEXT, created_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS radar_analyses (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, track_key TEXT NOT NULL, track_title TEXT NOT NULL, inferred_genre TEXT, version_label TEXT, score REAL NOT NULL, dimensions_json TEXT NOT NULL, benchmark_json TEXT, ai_comment TEXT, created_at TEXT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS web_channels (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, country TEXT, language TEXT, genres_json TEXT, cost_type TEXT, ai_policy TEXT, submission_method TEXT, login_required INTEGER NOT NULL DEFAULT 0, official_url TEXT NOT NULL, status TEXT NOT NULL, last_verified_at TEXT NOT NULL, notes TEXT)`,
`CREATE TABLE IF NOT EXISTS ai_usage (id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id) ON DELETE SET NULL, provider TEXT NOT NULL, operation TEXT NOT NULL, units REAL, success INTEGER NOT NULL, created_at TEXT NOT NULL)`,
`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash)`,
`CREATE INDEX IF NOT EXISTS idx_oauth_state_hash ON oauth_states(state_hash)`,
`CREATE INDEX IF NOT EXISTS idx_publications_user_date ON publications(user_id, created_at DESC)`,
`CREATE INDEX IF NOT EXISTS idx_tracking_publication ON tracking_events(publication_id, created_at DESC)`,
`CREATE INDEX IF NOT EXISTS idx_radar_user_track ON radar_analyses(user_id, track_key, created_at DESC)`
];

export async function ensureSchema(db){
  if(!db) return {ready:false,error:'DB binding ausente'};
  try{
    await db.batch(SCHEMA_V10.map(sql=>db.prepare(sql)));
    const row=await db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name IN ('users','sessions','artist_profiles','publications','radar_analyses')").first();
    return {ready:Number(row?.n||0)>=5,tables:Number(row?.n||0)};
  }catch(err){
    return {ready:false,error:String(err?.message||err)};
  }
}
