const Heading = ({
  children,
  variant = 'h1',
}: {
  children: React.ReactNode;
  variant?: 'h1' | 'h2';
}) => {
  if (variant === 'h1') {
    return <h1 className="text-3xl font-bold">{children}</h1>;
  }
};

export default Heading;
