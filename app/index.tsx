import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';

export default function Index() {
  const onboarded = useUserStore((s) => s.onboarded);
  return <Redirect href={onboarded ? '/(tabs)' : '/onboarding'} />;
}
