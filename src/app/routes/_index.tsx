import type { MetaFunction } from "@remix-run/cloudflare";
import { frens } from "src/ring";

export const meta: MetaFunction = () => {
  return [
    { title: "hayden@web ~" },
    { name: "description", content: "The blog of a lowly DevOps Engineer from the UK. Federated on atproto!" },
  ];
};

export default () => {
  return (
    <>
      <div className="prose max-w-5xl">
        <p>
          I love working with all things DevOps, from automation and software
          engineering to full-on platform engineering. I’m a huge advocate for making
          things self-service and as reproducible as possible (hence my love/hate
          relationship with <a href="https://nixos.org">Nix</a>).
        </p>

        <p>
          Recently, I’ve been learning how to build developer-focal automation,
          building up understanding of how to view both sides of the infrastructure
          coin; platform administration and developers.
        </p>

        <p>
          I think pineapple on pizza is a crime, I listen to everything from rock and
          indie to jungle and breakcore, and I’m a huge fan of virtual reality.
        </p>

        <p>
          I’m based in Sheffield, in the UK, and I’m always open to having
          conversations with people about any topic you think I’d find interesting.
        </p>

        <p>
          <span className="line-through">also <a href="https://nohello.net">nohello.net</a> pls thx</span>
        </p>
      </div>

      <div className="mt-6 max-w-5xl flex flex-col gap-2">
        <p className="text-blue underline">Webring</p>
        <div className="flex items-center gap-4">
          {frens.map((fren, idx) => (
            <a href={fren.url} key={idx}>
              <img
                src={fren.img}
                className="rendering-pixelated"
                width={88}
                height={31}
                alt={fren.name}
              />
            </a>
          ))}
        </div>
        <div className="p-2 bg-[var(--base01)] block">
          <p>Wanna add me to yours? Here's my badge!</p>
          <img
            src={`/88x31/hayden.png`}
            className="rendering-pixelated"
            width={88}
            height={31}
            alt="Hayden"
          />
        </div>
      </div>
    </>
  );
}
