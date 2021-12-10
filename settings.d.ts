declare const Settings: {
  headPkgs: string[];
  scope: string;
  siteTitle: string;
  requestLibPath: string;
  services: Record<
    string,
    {
      proxy: {
        host: string;
        pathRewrite?: boolean;
      };
      swaggerPort: number;
      name: string;
      description: string;
      openapi?: boolean;
    }
  >;
};
export default Settings;
