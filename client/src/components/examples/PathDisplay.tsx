import { PathDisplay } from '../PathDisplay';

export default function PathDisplayExample() {
  return (
    <div className="space-y-4 p-4">
      <PathDisplay
        path={[
          { name: "The Hermit", type: "TarotCard" },
          { name: "Virgo", type: "ZodiacSign" },
          { name: "Mercury", type: "Planet" },
        ]}
        relationships={["ASSOCIATED_WITH_SIGN", "RULED_BY"]}
        onClick={() => console.log('Path clicked')}
      />
      <PathDisplay
        path={[
          { name: "The Magician", type: "TarotCard" },
          { name: "Mercury", type: "Planet" },
          { name: "Gemini", type: "ZodiacSign" },
          { name: "Air", type: "Element" },
        ]}
        relationships={["RULED_BY_PLANET", "TRADITIONALLY_RULES", "HAS_ELEMENT"]}
        onClick={() => console.log('Path 2 clicked')}
      />
    </div>
  );
}
