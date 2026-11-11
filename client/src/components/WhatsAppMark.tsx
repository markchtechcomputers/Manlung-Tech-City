type WhatsAppMarkProps = {
  className?: string;
};

export default function WhatsAppMark({ className }: WhatsAppMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 3A12.9 12.9 0 0 0 4.8 22.4L3 29l6.7-1.8A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1.1-3.8-.3-.5A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2s0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1.1-1.1 2.6 1.1 3 1.2 3.2 2.2 3.3 5.2 4.6c.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.9-.8 2.2-1.6.3-.7.3-1.4.2-1.5s-.3-.2-.6-.4Z" />
    </svg>
  );
}
