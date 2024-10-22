export const Footer = () => {
  const today = new Date();

  return (
    <p className="text-muted px-4 py-2">
      Copyright (c) Hayden Young {today.getFullYear()}.
    </p>
  )
}
