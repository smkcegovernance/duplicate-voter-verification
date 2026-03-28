import { redirect } from 'next/navigation';

export default function DepositManagerPage() {
  // Redirect to login page
  redirect('/depositmanager/login');
}
