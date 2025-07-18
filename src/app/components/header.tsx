export const Header = () => (
  <nav className="h-10 border-b border-muted justify-left divide-x divide-muted [&>a]:py-1 [&>a]:px-4 fixed w-full bg-black flex items-center">
    <a href="/" className="flex items-center gap-2 text-base0A">
      <span>hayden@web ~</span>
      <div className="w-[10px] h-[21px] animate-blink bg-pink"></div>
    </a>

    <a className="hover:text-base0E" href="/posts">posts</a>
    <a className="hover:text-base0E border-r! border-muted" href="/rss.xml">rss</a>
  </nav>
);
