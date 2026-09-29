import { useEffect, useState } from "react";
import { fetchBeers, API_BASE } from "../api/beer";
import BeerCard from "../components/BeerCard";
import TowerGame from "../components/towerGame/index";

export default function Playroom() {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentGame, setCurrentGame] = useState("roulette");

  // Roulette state
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [spinning, setSpinning] = useState(false);

  // Trivia state
  const [triviaQuestion, setTriviaQuestion] = useState(null);
  const [triviaAnswer, setTriviaAnswer] = useState("");
  const [triviaResult, setTriviaResult] = useState(null);

  // Guessing state
  const [guessBeer, setGuessBeer] = useState(null);
  const [guessInput, setGuessInput] = useState("");
  const [guessResult, setGuessResult] = useState(null);

  // Pong state
  const [pongCups, setPongCups] = useState(Array(10).fill(false));
  const [pongThrows, setPongThrows] = useState(0);
  const [pongScore, setPongScore] = useState(0);
  const [throwing, setThrowing] = useState(false);

  // Memory state
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Tower state
  const [towerGame, setTowerGame] = useState(null);
  const [towerScore, setTowerScore] = useState(0);
  const [towerSuccess, setTowerSuccess] = useState(0);
  const [towerFailed, setTowerFailed] = useState(0);

  useEffect(() => {
    const loadBeers = async () => {
      try {
        const beerData = await fetchBeers();
        setBeers(beerData);
      } catch (error) {
        console.error('Failed to load beers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBeers();
  }, []);

  useEffect(() => {
    if (currentGame === "tower") {
      const canvas = document.getElementById('tower-canvas');
      if (canvas && !towerGame) {
        const game = TowerGame({
          width: 400,
          height: 600,
          canvasId: 'tower-canvas',
          soundOn: false,
          setGameScore: (score) => setTowerScore(score),
          setGameSuccess: (success) => setTowerSuccess(success),
          setGameFailed: (failed) => setTowerFailed(failed)
        });
        game.load(() => {
          game.init();
          setTowerGame(game);
        });
      }
    }
  }, [currentGame, towerGame]);

  const triviaQuestions = [
    {
      question: "What is the main ingredient in beer?",
      options: ["Grapes", "Wheat", "Barley", "Rice"],
      answer: "Barley"
    },
    {
      question: "Which country is famous for Pilsner beer?",
      options: ["Germany", "Czech Republic", "Belgium", "Ireland"],
      answer: "Czech Republic"
    },
    {
      question: "What does IPA stand for?",
      options: ["Indian Pale Ale", "International Pale Ale", "Irish Pale Ale", "Italian Pale Ale"],
      answer: "Indian Pale Ale"
    },
    {
      question: "Which beer style is known for its high alcohol content and dark color?",
      options: ["Lager", "Stout", "Pilsner", "Wheat Beer"],
      answer: "Stout"
    },
    {
      question: "What is the process called where beer is fermented at higher temperatures?",
      options: ["Lager", "Ale", "Porter", "Bock"],
      answer: "Ale"
    }
  ];



  const pickRandomBeer = () => {
    if (beers.length === 0) return;
    setSpinning(true);
    setSelectedBeer(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * beers.length);
      setSelectedBeer(beers[randomIndex]);
      setSpinning(false);
    }, 2000);
  };

  const startTrivia = () => {
    const randomQuestion = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    setTriviaQuestion(randomQuestion);
    setTriviaAnswer("");
    setTriviaResult(null);
  };

  const checkTriviaAnswer = () => {
    if (triviaAnswer === triviaQuestion.answer) {
      setTriviaResult("correct");
    } else {
      setTriviaResult("incorrect");
    }
  };

  const startGuessingGame = () => {
    if (beers.length === 0) return;
    const randomBeer = beers[Math.floor(Math.random() * beers.length)];
    setGuessBeer(randomBeer);
    setGuessInput("");
    setGuessResult(null);
  };

  const checkGuess = () => {
    const correct = guessInput.toLowerCase().trim() === (guessBeer.beer_name || guessBeer.name).toLowerCase().trim();
    setGuessResult(correct ? "correct" : "incorrect");
  };

  const resetPong = () => {
    setPongCups(Array(10).fill(false));
    setPongThrows(0);
    setPongScore(0);
  };

  const throwBall = () => {
    if (pongThrows >= 10) return;
    setThrowing(true);
    setTimeout(() => {
      const success = Math.random() > 0.4; // 60% success rate
      if (success) {
        const availableCups = pongCups.map((cup, i) => cup ? -1 : i).filter(i => i !== -1);
        if (availableCups.length > 0) {
          const randomCup = availableCups[Math.floor(Math.random() * availableCups.length)];
          const newCups = [...pongCups];
          newCups[randomCup] = true;
          setPongCups(newCups);
          setPongScore(prev => prev + 1);
        }
      }
      setPongThrows(prev => prev + 1);
      setThrowing(false);
    }, 1500);
  };

  const initializeMemory = () => {
    if (beers.length < 6) return;
    const selectedBeers = beers.slice(0, 6);
    const cards = [...selectedBeers, ...selectedBeers].map((beer, index) => ({
      id: index,
      beer,
      flipped: false
    }));
    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setMemoryCards(cards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
  };

  const flipMemoryCard = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      const firstCard = memoryCards.find(c => c.id === first);
      const secondCard = memoryCards.find(c => c.id === second);

      if (firstCard.beer.beer_id === secondCard.beer.beer_id) {
        setMatchedCards(prev => [...prev, first, second]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };



  return (
    <div className="page-transition" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "15px",
        padding: "30px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px",
          borderBottom: "3px solid #ecf0f1",
          paddingBottom: "20px"
        }}>
          <h1 style={{
            color: "#2c3e50",
            margin: "0 0 10px 0",
            fontSize: "3rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            fontWeight: "bold"
          }}>
            🎮 Beer Playroom
          </h1>
          <p style={{
            color: "#7f8c8d",
            fontSize: "1.2rem",
            margin: 0,
            fontStyle: "italic"
          }}>
            Fun beer-related mini games to enjoy!
          </p>
        </div>

        {/* Game Selection */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "40px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => setCurrentGame("roulette")}
            style={{
              padding: "10px 20px",
              background: currentGame === "roulette" ? "linear-gradient(45deg, #3498db, #2980b9)" : "#ecf0f1",
              color: currentGame === "roulette" ? "white" : "#2c3e50",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            🍺 Beer Roulette
          </button>
          <button
            onClick={() => setCurrentGame("trivia")}
            style={{
              padding: "10px 20px",
              background: currentGame === "trivia" ? "linear-gradient(45deg, #3498db, #2980b9)" : "#ecf0f1",
              color: currentGame === "trivia" ? "white" : "#2c3e50",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            🧠 Beer Trivia
          </button>
          <button
            onClick={() => setCurrentGame("guessing")}
            style={{
              padding: "10px 20px",
              background: currentGame === "guessing" ? "linear-gradient(45deg, #3498db, #2980b9)" : "#ecf0f1",
              color: currentGame === "guessing" ? "white" : "#2c3e50",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            🔍 Beer Guessing
          </button>
          <button
            onClick={() => setCurrentGame("pong")}
            style={{
              padding: "10px 20px",
              background: currentGame === "pong" ? "linear-gradient(45deg, #3498db, #2980b9)" : "#ecf0f1",
              color: currentGame === "pong" ? "white" : "#2c3e50",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            🏓 Beer Pong
          </button>
          <button
            onClick={() => setCurrentGame("memory")}
            style={{
              padding: "10px 20px",
              background: currentGame === "memory" ? "linear-gradient(45deg, #3498db, #2980b9)" : "#ecf0f1",
              color: currentGame === "memory" ? "white" : "#2c3e50",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            🧠 Beer Memory
          </button>
          <button
            onClick={() => setCurrentGame("tower")}
            style={{
              padding: "10px 20px",
              background: currentGame === "tower" ? "linear-gradient(45deg, #3498db, #2980b9)" : "#ecf0f1",
              color: currentGame === "tower" ? "white" : "#2c3e50",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            🏗️ Beer Tower
          </button>
        </div>

        {/* Beer Roulette */}
        {currentGame === "roulette" && (
          <div>
            <h2 style={{
              color: "#2c3e50",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "2rem"
            }}>
              🍺 Beer Roulette
            </h2>
            <p style={{
              textAlign: "center",
              color: "#7f8c8d",
              fontSize: "1.1rem",
              marginBottom: "30px"
            }}>
              Can't decide what to drink? Let fate choose for you! Click the button to spin the wheel and discover a random beer from our catalog.
            </p>

            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <button
                onClick={pickRandomBeer}
                disabled={loading || spinning || beers.length === 0}
                style={{
                  padding: "15px 30px",
                  fontSize: "1.2rem",
                  background: spinning ? "linear-gradient(45deg, #f39c12, #e67e22)" : "linear-gradient(45deg, #3498db, #2980b9)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: loading || spinning || beers.length === 0 ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  minWidth: "200px"
                }}
                onMouseOver={(e) => {
                  if (!loading && !spinning && beers.length > 0) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(52, 152, 219, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
                }}
              >
                {spinning ? "🎰 Spinning..." : "🎲 Spin the Wheel!"}
              </button>
            </div>

            {selectedBeer && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30px"
              }}>
                <div style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  maxWidth: "400px",
                  width: "100%"
                }}>
                  <h3 style={{
                    color: "#2c3e50",
                    textAlign: "center",
                    marginBottom: "20px",
                    fontSize: "1.5rem"
                  }}>
                    🎉 Your Random Beer:
                  </h3>
                  <BeerCard beer={selectedBeer} />
                </div>
              </div>
            )}

            {spinning && (
              <div style={{
                textAlign: "center",
                marginTop: "30px",
                color: "#7f8c8d",
                fontSize: "1.2rem"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🎰</div>
                <div>Spinning the wheel...</div>
              </div>
            )}
          </div>
        )}

        {/* Beer Trivia */}
        {currentGame === "trivia" && (
          <div>
            <h2 style={{
              color: "#2c3e50",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "2rem"
            }}>
              🧠 Beer Trivia
            </h2>
            <p style={{
              textAlign: "center",
              color: "#7f8c8d",
              fontSize: "1.1rem",
              marginBottom: "30px"
            }}>
              Test your beer knowledge with fun trivia questions!
            </p>

            {!triviaQuestion ? (
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={startTrivia}
                  style={{
                    padding: "15px 30px",
                    fontSize: "1.2rem",
                    background: "linear-gradient(45deg, #27ae60, #229954)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(39, 174, 96, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(39, 174, 96, 0.3)";
                  }}
                >
                  🎯 Start Trivia
                </button>
              </div>
            ) : (
              <div style={{
                maxWidth: "600px",
                margin: "0 auto",
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "15px",
                padding: "30px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>{triviaQuestion.question}</h3>
                <div style={{ marginBottom: "20px" }}>
                  {triviaQuestion.options.map((option, index) => (
                    <label key={index} style={{ display: "block", marginBottom: "10px" }}>
                      <input
                        type="radio"
                        name="trivia"
                        value={option}
                        checked={triviaAnswer === option}
                        onChange={(e) => setTriviaAnswer(e.target.value)}
                        style={{ marginRight: "10px" }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={checkTriviaAnswer}
                    disabled={!triviaAnswer}
                    style={{
                      padding: "10px 20px",
                      background: "linear-gradient(45deg, #3498db, #2980b9)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: triviaAnswer ? "pointer" : "not-allowed",
                      marginRight: "10px"
                    }}
                  >
                    Submit Answer
                  </button>
                  <button
                    onClick={startTrivia}
                    style={{
                      padding: "10px 20px",
                      background: "#ecf0f1",
                      color: "#2c3e50",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer"
                    }}
                  >
                    New Question
                  </button>
                </div>
                {triviaResult && (
                  <div style={{
                    marginTop: "20px",
                    textAlign: "center",
                    color: triviaResult === "correct" ? "#27ae60" : "#e74c3c",
                    fontWeight: "bold"
                  }}>
                    {triviaResult === "correct" ? "🎉 Correct!" : `❌ Incorrect! The answer is: ${triviaQuestion.answer}`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Beer Guessing */}
        {currentGame === "guessing" && (
          <div>
            <h2 style={{
              color: "#2c3e50",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "2rem"
            }}>
              🔍 Beer Guessing Game
            </h2>
            <p style={{
              textAlign: "center",
              color: "#7f8c8d",
              fontSize: "1.1rem",
              marginBottom: "30px"
            }}>
              Guess the beer name based on its details!
            </p>

            {!guessBeer ? (
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={startGuessingGame}
                  disabled={loading || beers.length === 0}
                  style={{
                    padding: "15px 30px",
                    fontSize: "1.2rem",
                    background: "linear-gradient(45deg, #9b59b6, #8e44ad)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: loading || beers.length === 0 ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 15px rgba(155, 89, 182, 0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseOver={(e) => {
                    if (!loading && beers.length > 0) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 20px rgba(155, 89, 182, 0.4)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(155, 89, 182, 0.3)";
                  }}
                >
                  🎲 Start Guessing
                </button>
              </div>
            ) : (
              <div style={{
                maxWidth: "600px",
                margin: "0 auto",
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "15px",
                padding: "30px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
              }}>
                <div style={{ marginBottom: "20px" }}>
                  <p><strong>Country:</strong> {guessBeer.country_of_origin}</p>
                  <p><strong>Alcohol Content:</strong> {guessBeer.alcohol_content}%</p>
                  <p><strong>Beer Kind:</strong> {guessBeer.beer_kind}</p>
                  <p><strong>Container:</strong> {guessBeer.container_kind}</p>
                  <p><strong>Volume:</strong> {guessBeer.volume_liters}L</p>
                  <p><strong>Price:</strong> €{guessBeer.price}</p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <input
                    type="text"
                    placeholder="Guess the beer name..."
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #ecf0f1",
                      borderRadius: "10px",
                      fontSize: "1rem"
                    }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={checkGuess}
                    disabled={!guessInput.trim()}
                    style={{
                      padding: "10px 20px",
                      background: "linear-gradient(45deg, #3498db, #2980b9)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: guessInput.trim() ? "pointer" : "not-allowed",
                      marginRight: "10px"
                    }}
                  >
                    Guess
                  </button>
                  <button
                    onClick={startGuessingGame}
                    style={{
                      padding: "10px 20px",
                      background: "#ecf0f1",
                      color: "#2c3e50",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer"
                    }}
                  >
                    New Beer
                  </button>
                </div>
                {guessResult && (
                  <div style={{
                    marginTop: "20px",
                    textAlign: "center",
                    color: guessResult === "correct" ? "#27ae60" : "#e74c3c",
                    fontWeight: "bold"
                  }}>
                    {guessResult === "correct" ? "🎉 Correct!" : `❌ Incorrect! The beer is: ${guessBeer.beer_name || guessBeer.name}`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Beer Pong */}
        {currentGame === "pong" && (
          <div>
            <h2 style={{
              color: "#2c3e50",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "2rem"
            }}>
              🏓 Beer Pong Simulator
            </h2>
            <p style={{
              textAlign: "center",
              color: "#7f8c8d",
              fontSize: "1.1rem",
              marginBottom: "30px"
            }}>
              Test your aim! Throw ping pong balls into the cups. You have 10 throws.
            </p>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                Throws: {pongThrows}/10 | Score: {pongScore}/10
              </div>
              <button
                onClick={throwBall}
                disabled={throwing || pongThrows >= 10}
                style={{
                  padding: "15px 30px",
                  fontSize: "1.2rem",
                  background: throwing ? "linear-gradient(45deg, #f39c12, #e67e22)" : "linear-gradient(45deg, #e74c3c, #c0392b)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: throwing || pongThrows >= 10 ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  marginRight: "10px"
                }}
                onMouseOver={(e) => {
                  if (!throwing && pongThrows < 10) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(231, 76, 60, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(231, 76, 60, 0.3)";
                }}
              >
                {throwing ? "🏐 Throwing..." : "🏐 Throw Ball!"}
              </button>
              <button
                onClick={resetPong}
                style={{
                  padding: "15px 30px",
                  fontSize: "1.2rem",
                  background: "#ecf0f1",
                  color: "#2c3e50",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                🔄 Reset Game
              </button>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px"
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "15px",
                maxWidth: "400px"
              }}>
                {pongCups.map((cup, index) => (
                  <div
                    key={index}
                    style={{
                      width: "50px",
                      height: "60px",
                      background: cup ? "linear-gradient(45deg, #27ae60, #229954)" : "linear-gradient(45deg, #ecf0f1, #bdc3c7)",
                      borderRadius: "5px 5px 20px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      border: "2px solid #34495e"
                    }}
                  >
                    {cup ? "💧" : "🍺"}
                  </div>
                ))}
              </div>
            </div>

            {pongThrows >= 10 && (
              <div style={{
                textAlign: "center",
                marginTop: "30px",
                color: pongScore >= 5 ? "#27ae60" : "#e74c3c",
                fontSize: "1.5rem",
                fontWeight: "bold"
              }}>
                Game Over! Final Score: {pongScore}/10
                {pongScore >= 5 ? " 🎉 Great job!" : " 😅 Better luck next time!"}
              </div>
            )}
          </div>
        )}

        {/* Beer Memory */}
        {currentGame === "memory" && (
          <div>
            <h2 style={{
              color: "#2c3e50",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "2rem"
            }}>
              🧠 Beer Memory Game
            </h2>
            <p style={{
              textAlign: "center",
              color: "#7f8c8d",
              fontSize: "1.1rem",
              marginBottom: "30px"
            }}>
              Match pairs of beer cards! Flip two cards at a time to find matches.
            </p>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                Moves: {memoryMoves} | Matches: {matchedCards.length / 2}/6
              </div>
              <button
                onClick={initializeMemory}
                disabled={loading || beers.length < 6}
                style={{
                  padding: "15px 30px",
                  fontSize: "1.2rem",
                  background: "linear-gradient(45deg, #9b59b6, #8e44ad)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: loading || beers.length < 6 ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 15px rgba(155, 89, 182, 0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseOver={(e) => {
                  if (!loading && beers.length >= 6) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(155, 89, 182, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(155, 89, 182, 0.3)";
                }}
              >
                🎮 Start New Game
              </button>
            </div>

            {memoryCards.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "15px",
                maxWidth: "600px",
                margin: "0 auto"
              }}>
                {memoryCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => flipMemoryCard(card.id)}
                    style={{
                      width: "120px",
                      height: "120px",
                      background: flippedCards.includes(card.id) || matchedCards.includes(card.id) ? "linear-gradient(45deg, #3498db, #2980b9)" : "linear-gradient(45deg, #ecf0f1, #bdc3c7)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      border: "2px solid #34495e",
                      color: flippedCards.includes(card.id) || matchedCards.includes(card.id) ? "white" : "#34495e",
                      textAlign: "center",
                      padding: "5px",
                      transition: "transform 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={`${API_BASE}/images/beers/${card.beer.beer_id}.jpg`}
                          alt={card.beer.beer_name || card.beer.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '5px'
                          }}
                          onError={(e) => {
                            e.target.src = `${API_BASE}/images/beers/${card.beer.beer_id}.png`;
                            e.target.onerror = () => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            };
                          }}
                        />
                        <div style={{ display: 'none', textAlign: 'center' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🍺</div>
                          <div style={{ fontSize: '0.7rem' }}>{card.beer.beer_name || card.beer.name}</div>
                        </div>
                      </div>
                    ) : (
                      "?"
                    )}
                  </div>
                ))}
              </div>
            )}

            {matchedCards.length === 12 && (
              <div style={{
                textAlign: "center",
                marginTop: "30px",
                color: "#27ae60",
                fontSize: "1.5rem",
                fontWeight: "bold"
              }}>
                🎉 Congratulations! You completed the game in {memoryMoves} moves!
              </div>
            )}
          </div>
        )}

        {/* Beer Tower Builder */}
        {currentGame === "tower" && (
          <div>
            <h2 style={{
              color: "#2c3e50",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "2rem"
            }}>
              🏗️ Beer Tower Builder
            </h2>
            <p style={{
              textAlign: "center",
              color: "#7f8c8d",
              fontSize: "1.1rem",
              marginBottom: "30px"
            }}>
              Stack blocks to build the tallest tower! Click or tap to drop blocks. Perfect stacks give bonus points!
            </p>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                Score: {towerScore} | Floors: {towerSuccess} | Lives: {3 - towerFailed}
              </div>
              <button
                onClick={() => {
                  if (towerGame) {
                    towerGame.start();
                  }
                }}
                style={{
                  padding: "15px 30px",
                  fontSize: "1.2rem",
                  background: "linear-gradient(45deg, #27ae60, #229954)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  marginRight: "10px"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(39, 174, 96, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(39, 174, 96, 0.3)";
                }}
              >
                🎯 Start Game
              </button>
              <button
                onClick={() => {
                  if (towerGame) {
                    window.location.reload(); // Simple reset
                  }
                }}
                style={{
                  padding: "15px 30px",
                  fontSize: "1.2rem",
                  background: "#ecf0f1",
                  color: "#2c3e50",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                🔄 Reset
              </button>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px"
            }}>
              <canvas
                id="tower-canvas"
                width="400"
                height="600"
                style={{
                  border: "5px solid #34495e",
                  borderRadius: "10px",
                  background: "#87CEEB"
                }}
              ></canvas>
            </div>

            <div style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#7f8c8d",
              fontSize: "0.9rem",
              fontStyle: "italic"
            }}>
              Special thanks to the original tower game by <a href="https://github.com/iamkun/tower_game" target="_blank" rel="noopener noreferrer" style={{ color: "#3498db", textDecoration: "none" }}>iamkun</a> on GitHub.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}