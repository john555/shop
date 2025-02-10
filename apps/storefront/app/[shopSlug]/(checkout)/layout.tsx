import { Footer } from '../(shopping)/components/footer';
import { SimpleHeader } from '../(shopping)/components/simple-header';

export default function CheckoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SimpleHeader />
      {children}
      <Footer />
    </div>
  );
}
