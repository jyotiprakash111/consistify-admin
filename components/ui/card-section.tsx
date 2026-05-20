import { card, sectionTitle } from '@/lib/ui-classes';

type CardSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function CardSection({ title, children, className = '' }: CardSectionProps) {
  return (
    <section className={`${card} ${className}`}>
      <h3 className={sectionTitle.replace('mt-6', 'mt-0')}>{title}</h3>
      {children}
    </section>
  );
}
