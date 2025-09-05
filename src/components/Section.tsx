interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`min-h-screen flex items-center justify-center py-20 px-6 ${className}`}>
      {children}
    </section>
  );
}