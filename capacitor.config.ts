import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.menuapp.angular',
  appName: 'cap-test',
  webDir: 'dist/cap-test/browser',
  server: {
    url: 'https://mobile.haina.id.vn',
    cleartext: true,
  },
};

export default config;
