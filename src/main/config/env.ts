export const env = {
  port: process.env.PORT ?? '8080',
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '595687031997577',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '9f5fa85b738393638a43b103a0cdf17d'
  },
  jwtSecret: process.env.JWT_SECRET ?? '98as&%ADRS87std87'
}
