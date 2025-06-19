import { useRef, useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MultiBackend } from 'dnd-multi-backend';
import { TouchTransition } from 'dnd-multi-backend'; // ✅ apenas os necessários

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: undefined,
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};



const CARD = 'CARD';


interface DraggableCardProps {
  text: string;
  isAdult?: boolean;
}

function DraggableCard({ text, isAdult = false }: DraggableCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: CARD,
    item: { text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [ref, drag]);

  return (
    <div
      ref={ref}
      className={`px-3 py-2 rounded-xl shadow-md m-1 cursor-move select-none text-sm ${
        isAdult
          ? 'bg-pink-200 text-pink-900'
          : 'bg-amber-100 text-stone-800'
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {text}
    </div>
  );
}


interface DropSlotProps {
  index: number;
  onDrop: (index: number, text: string) => void;
  current: string | null;
  label: string;
}

function DropSlot({ index, onDrop, current, label }: DropSlotProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [, drop] = useDrop(() => ({
    accept: CARD,
    drop: (item: { text: string }) => onDrop(index, item.text),
  }));

  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [ref, drop]);

  return (
    <div className="mb-2">
      {label && <p className="text-stone-700 mb-1 font-semibold">{label}</p>}
      <div
        ref={ref}
        className="border-2 border-dashed border-amber-300 max-h-[40px] rounded-xl px-3 py-2 bg-white bg-opacity-60 text-sm text-stone-800 select-none w-full"
      >
        {current || 'Arraste uma opção aqui...'}
      </div>
    </div>
  );
}


export default function App() {
  const [isAdultMode, setIsAdultMode] = useState(false);
  const [slots, setSlots] = useState<(string | null)[]>(Array(6).fill(null));
  const [customCards, setCustomCards] = useState<string[]>([]);
  const [newCardText, setNewCardText] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  type CardOption = { text: string; isAdult?: boolean };

  const getCards = (isAdultMode: boolean): Record<string, CardOption[]> => {
    const base: Record<string, CardOption[]> = {
      'Encontro Inicial': [
        { text: 'em uma cafeteria aconchegante' },
        { text: 'em frente a um ponto de referência famoso da cidade' },
        { text: 'na estação de metrô mais próxima' },
        { text: 'em uma feira de rua com artesanato local' },
        { text: 'no terraço de um prédio com vista para a cidade' },
        { text: 'em uma doceria pequena e charmosa' },
        { text: 'na frente de uma floricultura movimentada' },
        { text: 'em um shopping perto de você' },
      ],
      'Passeio Matinal': [
        { text: 'um passeio em um parque arborizado' },
        { text: 'visitar um museu de arte moderna' },
        { text: 'explorar um jardim botânico com trilhas' },
        { text: 'conhecer uma feira de arte e antiguidades' },
        { text: 'visitar uma livraria com área de café' },
        { text: 'fazer um passeio de bicicleta pela ciclovia' },
        { text: 'ver animais em um zoológico urbano' },
        { text: 'assistir a uma apresentação de música de rua' },
      ],
      'Almoço': [
        { text: 'um restaurante italiano com massas frescas' },
        { text: 'um food truck com hambúrguer artesanal' },
        { text: 'um piquenique em um parque com lago' },
        { text: 'uma cantina com comida caseira' },
        { text: 'uma churrascaria com rodízio de carnes' },
        { text: 'comida japonesa com sushi e sashimi' },
        { text: 'um rodízio de pizzas e massas' },
        { text: 'um restaurante vegano com pratos criativos' },
      ],
      'Atividade da Tarde': [
        { text: 'tomar um café com bolo em uma confeitaria antiga' },
        { text: 'tomar um sorvete artesanal com sabores exóticos' },
        { text: 'andar de bicicleta em um parque com aluguel de bikes' },
        { text: 'jogar um jogo de tabuleiro em um café temático' },
        { text: 'fazer uma aula de dança de ritmos latinos' },
        { text: 'jogar jogos de fliperama em um bar retrô' },
        { text: 'desenhar juntos em um espaço de arte colaborativa' },
        { text: 'explorar um sebo e descobrir livros raros' },
      ],
      'Final da Tarde': [
        { text: 'assistir ao pôr do sol em um parque elevado' },
        { text: 'ver o pôr do sol de um mirante com vista panorâmica' },
        { text: 'relaxar em um bar com terraço e música ambiente' },
        { text: 'conversar em uma praça com bancos confortáveis' },
        { text: 'fotografar a cidade ao entardecer de um viaduto' },
        { text: 'sentar em uma cafeteria com vista para a rua' },
        { text: 'andar de mãos dadas em um bairro histórico' },
        { text: 'curtir o clima juntos debaixo de uma árvore frondosa' },
      ],
      'Encerramento do Date': [
        { text: 'um jantar à luz de velas em um restaurante romântico' },
        { text: 'ver as estrelas em um lugar afastado da cidade' },
        { text: 'assistir a um show acústico em um bar intimista' },
        { text: 'dançar lentamente em um salão de baile' },
        { text: 'contar histórias no terraço de casa, olhando as luzes da cidade' },
        { text: 'assistir a um filme cult em um cinema de rua' },
        { text: 'cozinhar juntos uma receita simples e gostosa' },
        { text: 'dar um passeio noturno de carro com a janela aberta' },
      ],
    };

    const extraAdult: Record<string, CardOption[]> = {
      'Atividade da Tarde': [
        { text: 'dar uns beijos no banco da praça', isAdult: true },
        { text: 'ficar abraçadinhos vendo o movimento', isAdult: true },
        { text: 'beijar na chuva sem se preocupar com nada', isAdult: true },
        { text: 'trocar carinhos escondidos em um cantinho do parque', isAdult: true },
        { text: 'uma massagem mútua com óleo perfumado', isAdult: true },
        { text: 'brincar de perguntas ousadas e reveladoras', isAdult: true },
      ],
      'Encerramento do Date': [
        { text: 'ficar de conchinha assistindo série', isAdult: true },
        { text: 'dar uns amassos com chuva caindo lá fora', isAdult: true },
        { text: 'assistir filme no sofá sob o mesmo cobertor... bem coladinhos', isAdult: true },
        { text: 'tomar banho juntos com velas acesas no banheiro', isAdult: true },
        { text: 'explorar um ao outro com olhares e toques suaves', isAdult: true },
        { text: 'finalizar com um carinho mais quente...', isAdult: true },
      ],
    };

    if (isAdultMode) {
      return {
        ...base,
        'Atividade da Tarde': [...base['Atividade da Tarde'], ...extraAdult['Atividade da Tarde']],
        'Encerramento do Date': [...base['Encerramento do Date'], ...extraAdult['Encerramento do Date']],
      };
    }
    return base;
  };


  const handleDrop = (index: number, text: string) => {
    setSlots((prevSlots) => {
      const newSlots = prevSlots.map((slotText) =>
        slotText === text ? null : slotText
      );
      newSlots[index] = text;
      return newSlots;
    });
    setShowResult(false); // Esconde o resultado ao mudar algo
  };

  const addCustomCard = () => {
    if (newCardText.trim()) {
      setCustomCards((prev) => [...prev, newCardText.trim()]);
      setNewCardText('');
    }
  };

  const steps = [
    {
      label: 'Encontro Inicial',
      textBefore: 'Nos encontraríamos em',
      slotIndex: 0,
    },
    {
      label: 'Passeio Matinal',
      textBefore: 'Depois, seguiríamos para',
      slotIndex: 1,
    },
    {
      label: 'Almoço',
      textBefore: 'Na hora do almoço, escolheríamos',
      slotIndex: 2,
    },
    {
      label: 'Atividade da Tarde',
      textBefore: 'À tarde, faríamos',
      slotIndex: 3,
    },
    {
      label: 'Final da Tarde',
      textBefore: 'Para finalizar a tarde, iríamos para',
      slotIndex: 4,
    },
    {
      label: 'Encerramento do Date',
      textBefore: 'À noite, terminaríamos com',
      slotIndex: 5,
    },
  ];

  const renderResult = () => (
    <div className="mt-8 text-center text-lg text-stone-700 bg-white bg-opacity-70 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">💖 Seu Date Ideal Comigo 💖</h2>
      <div className="space-y-4 text-left max-w-xl mx-auto">
        {steps.map(({ label, textBefore, slotIndex }) => (
          <p key={label} className="text-stone-800 text-lg">
            {textBefore} <strong>{slots[slotIndex] || '...'}</strong>.
          </p>
        ))}
      </div>
    </div>
  );

  const HTML5toTouch = {
    backends: [
      {
        backend: HTML5Backend,
        transition: undefined,
      },
      {
        backend: TouchBackend,
        options: { enableMouseEvents: true },
        preview: true,
        transition: TouchTransition,
      },
    ],
  };


  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div
        className="min-h-screen bg-gradient-to-b from-sky-100 via-lime-50 to-white bg-cover p-4 sm:p-6 font-serif"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80")',
        }}
      >
        <div className="bg-white bg-opacity-70 rounded-2xl p-4 sm:p-6 mx-auto shadow-xl w-full max-w-7xl">
          <h1 className="text-3xl font-bold text-stone-700 mb-1 text-center">
            ✨ Monte o Dia Ideal com o Gabriel ✨
          </h1>
          <p className="text-stone-700 text-center mb-6">
            Lembrando que ele é forte, bonito, inteligente, engraçado...
          </p>

          {/* ✅ Tornar layout flexível e responsivo */}
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Área dos slots */}
            <div className="flex-1 w-full max-w-3xl mx-auto">
              {steps.map(({ label, slotIndex, textBefore }) => (
                <div key={label} className="mb-6">
                  <p className="text-lg font-bold text-stone-800 mb-1">{label}</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <p className="text-stone-700 text-base whitespace-nowrap">{textBefore}</p>
                    <div className="flex-1 w-full">
                      <DropSlot
                        index={slotIndex}
                        onDrop={handleDrop}
                        current={slots[slotIndex]}
                        label=""
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="mt-4 bg-amber-300 hover:bg-amber-400 text-stone-800 font-semibold px-6 py-2 rounded-lg shadow block mx-auto"
                onClick={() => setShowResult((v) => !v)}
              >
                {showResult ? 'Esconder resultado' : 'Ver como ficou'}
              </button>

              {showResult && renderResult()}
            </div>

            {/* Área das opções */}
            <div className="flex-1 w-full max-w-3xl mx-auto">
              <div className="overflow-y-auto max-h-[750px]">
                <div className="text-center mb-4">
                  <label className="inline-flex items-center gap-2 text-stone-700 font-medium">
                    <input
                      type="checkbox"
                      checked={isAdultMode}
                      onChange={() => setIsAdultMode((v) => !v)}
                      className="w-5 h-5"
                    />
                    Ativar modo 18+ 🔥
                  </label>
                </div>

                <h2 className="text-xl text-stone-700 mb-4 text-center">
                  Opções disponíveis 💖
                </h2>

                {Object.entries(getCards(isAdultMode)).map(([category, items]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold text-stone-600 mb-2">{category}</h3>
                    <div className="flex flex-wrap justify-center">
                      {items.map(({ text, isAdult }, i) => (
                        <DraggableCard key={category + i} text={text} isAdult={!!isAdult} />
                      ))}
                    </div>
                  </div>
                ))}

                {customCards.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-stone-600 mb-2">Personalizados</h3>
                    <div className="flex flex-wrap justify-center">
                      {customCards.map((text, i) => (
                        <DraggableCard key={'custom' + i} text={text} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg text-stone-700 mb-2">Criar opção personalizada:</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newCardText}
                    onChange={(e) => setNewCardText(e.target.value)}
                    placeholder="Ex: jogar Twister"
                    className="px-3 py-2 rounded-lg border border-stone-300 w-full"
                  />
                  <button
                    onClick={addCustomCard}
                    className="bg-amber-200 text-stone-800 px-4 py-2 rounded-lg shadow hover:bg-amber-300"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
