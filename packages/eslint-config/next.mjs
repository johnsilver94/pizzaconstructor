import baseConfig from "./base.mjs";

export const nextConfig = [
  ...baseConfig,
  {
    rules: {
      "no-html-link-for-pages": "off",
    },
  },
];

export default nextConfig;
