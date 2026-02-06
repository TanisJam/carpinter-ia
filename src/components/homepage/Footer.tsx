interface FooterProps {
  text: string;
}

export function Footer({ text }: FooterProps) {
  return (
    <footer className="text-center text-sm text-gray-500 mt-8">{text}</footer>
  );
}
