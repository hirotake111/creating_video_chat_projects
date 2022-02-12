export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
};

export type Config = typeof config;
