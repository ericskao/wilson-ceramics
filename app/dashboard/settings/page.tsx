import AuthCode from '@/components/AuthCode';
import { lusitana } from '../../ui/fonts';

const Settings = () => {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Settings
      </h1>
      <AuthCode />
    </main>
  );
};

export default Settings;
