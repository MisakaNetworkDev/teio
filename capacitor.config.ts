import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'network.misaka.lexi',
  appName: 'LEXI 乐词',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  },
  server: {
    androidScheme: "http",
  }
};

export default config;
