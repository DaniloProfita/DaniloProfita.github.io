import { useState } from "react";
import { questions } from "./questions";
import larocaImg from './assets/laroca.jpg';
import gatoImg from './assets/gato.jpeg';
import gatonegroImg from './assets/gatonegro.jpg';



function App() {
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [rangeValue, setRangeValue] = useState(5);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  const question = questions[index];

  // Para pregunta 5 (index 4) calculamos opacidad y translateY para cajas
  const isQuestion5Range = index === 4 && question.type === "range";

  // Opacidad para roja (más visible cerca de 1)
  const opacityRed = isQuestion5Range ? Math.max(0, (5 - rangeValue) / 4) : 0;
  // Opacidad para azul (más visible cerca de 10)
  const opacityBlue = isQuestion5Range ? Math.max(0, (rangeValue - 5) / 4) : 0;

  // translateY para dar efecto que sube hacia arriba (más opaco = más arriba)
  const translateYRed = 20 * (1 - opacityRed); // mueve de 20px abajo a 0
  const translateYBlue = 20 * (1 - opacityBlue);

  const handleConfirm = () => {
    if (answered) {
      setFeedback(null);
      setSelectedOption(null);
      setRangeValue(5);
      setAnswered(false);
      setShowPulse(false);
      setIndex((prev) => prev + 1);
      return;
    }

    let answer;
    if (question.type === "multiple") {
      if (selectedOption === null) return;
      answer = selectedOption;
    } else {
      answer = rangeValue;
    }

    const isCorrect = answer === question.correctAnswer;
    setFeedback(isCorrect ? "✅ Correcto" : "❌ Incorrecto");
    setAnswered(true);

    setTimeout(() => {
      setShowPulse(true);
    }, 300);
  };

  if (index >= questions.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Gracias por jugar</h2>
          <p className="mb-6 font-semibold">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo nihil quia aliquid id pariatur ut neque officiis animi quo odit, itaque at, assumenda rerum eveniet iure vitae sit vero provident.</p>
          <img
            src={gatonegroImg}
            alt="Gato negro"
            className="w-32 h-32 object-cover rounded-full mx-auto gentle-pulse"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

    {/* Contenedor para imágenes arriba */}
    <div className="relative w-full max-w-md mb-4 h-24 flex justify-center items-end">
      <img
        src={larocaImg}
        alt="La Roca"
        style={{
          opacity: opacityRed,
          transform: `translateY(${translateYRed}px)`,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
        className="absolute bottom-0 w-20 h-20 object-cover rounded-full shadow-lg"
      />

      <img
        src={gatoImg}
        alt="Gato"
        style={{
          opacity: opacityBlue,
          transform: `translateY(${translateYBlue}px)`,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
        className="absolute bottom-0 w-20 h-20 object-cover rounded-full shadow-lg"
      />
    </div>


      {/* Contenedor preguntas y opciones */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        {/* Mensaje de feedback */}
        {feedback && (
          <div
            className={`mb-4 text-lg font-semibold
              transition-opacity duration-500 ease-in-out
              transform origin-center
              ${showPulse ? "text-pulse opacity-100 scale-100" : "opacity-0 scale-80"}
            `}
          >
            {feedback}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">{question.question}</h2>

        {question.type === "multiple" ? (
          <>
            <div className="space-y-2 mb-4">
              {question.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                return (
                  <button
                    key={i}
                    onClick={() => !answered && setSelectedOption(i)}
                    className={`w-full py-2 px-4 rounded border
                      ${
                        isSelected
                          ? "bg-blue-500 text-white border-blue-700 animate-pulse"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }
                      ${answered ? "cursor-default opacity-70" : "cursor-pointer"}
                    `}
                    disabled={answered}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleConfirm}
              disabled={!answered && selectedOption === null}
              className={`w-full py-2 px-4 rounded text-white ${
                !answered && selectedOption === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : answered
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {answered ? "Siguiente" : "Confirmar"}
            </button>
          </>
        ) : (
          <>
            <input
              type="range"
              min="1"
              max="10"
              value={rangeValue}
              onChange={(e) => !answered && setRangeValue(Number(e.target.value))}
              className={`w-full my-4 ${answered ? "opacity-70 cursor-default" : ""}`}
              disabled={answered}
            />
            <div className="text-gray-600 mb-4">Valor seleccionado: {rangeValue}</div>
            <button
              onClick={handleConfirm}
              className={`w-full py-2 px-4 rounded text-white ${
                answered ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {answered ? "Siguiente" : "Confirmar"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
