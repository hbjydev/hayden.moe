import { MetaFunction } from "react-router";
import { frens } from "src/ring";

export const meta: MetaFunction = () => {
  return [
    { title: "hayden@web ~/ring" },
    { name: "description", content: "The blog of a lowly DevOps Engineer from the UK. Federated on atproto!" },
  ];
};

export default () => {
  return (
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        <span className="font-bold text-lg text-blue">Webring</span>

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
        <div className="p-2 bg-base01 block">
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
  );
};
