export const Footer = () => {
  const today = new Date();

  return (
    <p className="text-base-03 px-4 py-2">
      Copyright (c) Hayden Young {today.getFullYear()}.
    </p>
  )
}
