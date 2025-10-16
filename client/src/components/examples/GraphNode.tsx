import { GraphNode } from '../GraphNode';

export default function GraphNodeExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <GraphNode
        name="The Hermit"
        type="TarotCard"
        keywords="introspection, solitude, wisdom"
        onClick={() => console.log('The Hermit clicked')}
      />
      <GraphNode
        name="Virgo"
        type="ZodiacSign"
        keywords="analytical, practical, service"
        onClick={() => console.log('Virgo clicked')}
        isSelected={true}
      />
      <GraphNode
        name="Mercury"
        type="Planet"
        keywords="communication, intellect, swift"
        onClick={() => console.log('Mercury clicked')}
      />
      <GraphNode
        name="Fehu"
        type="Rune"
        keywords="wealth, abundance, prosperity"
        onClick={() => console.log('Fehu clicked')}
      />
    </div>
  );
}
