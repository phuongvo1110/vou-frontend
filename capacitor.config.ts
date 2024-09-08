import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.menuapp.angular',
  appName: 'cap-test',
  webDir: 'dist/cap-test/browser',
  server: {
    url: 'http://192.168.1.12:4200',
    cleartext: true,
  },
};

export default config;
