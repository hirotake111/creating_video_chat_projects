export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  saltRounds: parseInt(process.env.SALTROUNDS || "5"),
};

export type Config = typeof config;
