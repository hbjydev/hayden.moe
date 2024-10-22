import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "hayden@web ~" },
    { name: "description", content: "The blog of a lowly DevOps Engineer from the UK." },
  ];
};

export default () => {
  return (
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
  );
}
