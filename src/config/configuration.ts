export default () => ({
    port: parseInt(process.env.PORT ?? '4000', 10),
    mongoUri: process.env.MONGODB_URI,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    },
    corsOrigin: process.env.CORS_ORIGIN ?? '*',
    uploads: {
      dir: process.env.UPLOAD_DIR ?? './uploads',
      maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? '500', 10),
    },
  });