interface ToasterProps {
  message?: string;
}

function Toaster({ message }: ToasterProps) {
  if (!message) return null;

  return <div className="toast">{message}</div>;
}

export default Toaster;
