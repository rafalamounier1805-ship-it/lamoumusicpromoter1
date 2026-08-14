import app from './worker-v10.js';

const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});

export default {
  async fetch(req,env,ctx){
    const url=new URL(req.url);
    if(url.pathname==='/api/oauth/diagnostic'){
      return json({
        ok:true,
        spotify_client_id:!!env.SPOTIFY_CLIENT_ID,
        token_encryption_key:!!env.TOKEN_ENCRYPTION_KEY,
        spotify_oauth:!!(env.SPOTIFY_CLIENT_ID&&env.TOKEN_ENCRYPTION_KEY),
        db:!!env.DB,
        ai:!!env.AI
      });
    }
    return app.fetch(req,env,ctx);
  }
};
