import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedPair, setSelectedPair] = useState(0);
  const [str1, setStr1] = useState('Levenshtein');
  const [str2, setStr2] = useState('Lavenstaein');
  const [matrix, setMatrix] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const stringPairs = [
    { name: 'Pair 1: Levenshtein & Lavenstaein', str1: 'Levenshtein', str2: 'Lavenstaein' },
    { name: 'Pair 2: TryHackMe & TriHackingMe', str1: 'TryHackMe', str2: 'TriHackingMe' },
    { name: 'Pair 3: Optimization & Progressive', str1: 'Optimization', str2: 'Progressive' },
    { name: 'Pair 4: This is easy & This is easy', str1: 'This is easy', str2: 'This is easy' }
  ];

  const calculateLevenshtein = (s1, s2) => {
    const len1 = s1.length;
    const len2 = s2.length;
    
    
    const dp = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
    const newSteps = [];
    
   
    for (let i = 0; i <= len1; i++) {
      dp[i][0] = i;
      newSteps.push({
        type: 'init',
        i: i,
        j: 0,
        value: i,
        description: `Initialize dp[${i}][0] = ${i}`
      });
    }
    
    for (let j = 0; j <= len2; j++) {
      dp[0][j] = j;
      newSteps.push({
        type: 'init',
        i: 0,
        j: j,
        value: j,
        description: `Initialize dp[0][${j}] = ${j}`
      });
    }
    
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        const deletion = dp[i - 1][j] + 1;
        const insertion = dp[i][j - 1] + 1;
        const substitution = dp[i - 1][j - 1] + cost;
        
        dp[i][j] = Math.min(deletion, insertion, substitution);
        
        newSteps.push({
          type: 'calculation',
          i: i,
          j: j,
          value: dp[i][j],
          cost: cost,
          deletion: deletion,
          insertion: insertion,
          substitution: substitution,
          char1: s1[i - 1],
          char2: s2[j - 1],
          description: `dp[${i}][${j}] = min(${deletion}, ${insertion}, ${substitution}) = ${dp[i][j]}`
        });
      }
    }
    
    setMatrix(dp);
    setSteps(newSteps);
    setCurrentStep(0);
    return dp[len1][len2];
  };

  useEffect(() => {
    calculateLevenshtein(str1, str2);
  }, [str1, str2]);

  const handlePairChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedPair(index);
    setStr1(stringPairs[index].str1);
    setStr2(stringPairs[index].str2);
  };

  const animateSteps = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
  };

  const getCellClass = (i, j) => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      if (step.i === i && step.j === j) {
        return 'current-cell';
      }
      if (step.type === 'calculation' && 
          ((step.i === i && step.j === j) || 
           (step.i - 1 === i && step.j === j) || 
           (step.i === i && step.j - 1 === j) || 
           (step.i - 1 === i && step.j - 1 === j))) {
        return 'related-cell';
      }
    }
    return '';
  };

  const distance = matrix.length > 0 ? matrix[str1.length][str2.length] : 0;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Levenshtein Algorithm</h1>
        </header>

      <main className="main-content">
        
        <div className="explanation-section">
          <h2>What is Levenshtein Distance?</h2>
          <p>
            The Levenshtein distance (also called edit distance) is an algorithm used to determine the difference between two strings. 
            It measures the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into another.
          </p>
          
          <h3>How the Algorithm Works:</h3>
          <div className="algorithm-steps">
            <div className="step">
              <h4>1. Dynamic Programming Matrix</h4>
              <p>Create a matrix of size (m+1) × (n+1) where m and n are the lengths of the two strings.</p>
            </div>
            <div className="step">
              <h4>2. Base Cases</h4>
              <p>Initialize the first row and column with incremental values (0, 1, 2, 3, ...).</p>
            </div>
            <div className="step">
              <h4>3. Recursive Formula</h4>
              <p>For each cell (i,j), calculate the minimum of three operations:</p>
              <ul>
                <li><strong>Deletion:</strong> dp[i-1][j] + 1 (remove character from string 1)</li>
                <li><strong>Insertion:</strong> dp[i][j-1] + 1 (add character to string 1)</li>
                <li><strong>Substitution:</strong> dp[i-1][j-1] + cost (replace character, cost = 0 if same, 1 if different)</li>
              </ul>
            </div>
            <div className="step">
              <h4>4. Result</h4>
              <p>The value in the bottom-right cell (dp[m][n]) is the Levenshtein distance.</p>
            </div>
          </div>
        </div>

        
        <div className="pair-selection">
          <h3>Select String Pair to Analyze:</h3>
          <select value={selectedPair} onChange={handlePairChange} className="pair-dropdown">
            {stringPairs.map((pair, index) => (
              <option key={index} value={index}>
                {pair.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-section">
          <div className="input-group">
            <label htmlFor="str1">String 1:</label>
            <input
              id="str1"
              type="text"
              value={str1}
              onChange={(e) => setStr1(e.target.value)}
              placeholder="Enter first string"
            />
          </div>
          <div className="input-group">
            <label htmlFor="str2">String 2:</label>
            <input
              id="str2"
              type="text"
              value={str2}
              onChange={(e) => setStr2(e.target.value)}
              placeholder="Enter second string"
            />
          </div>
        </div>

        <div className="result-section">
          <h2>Levenshtein Distance: {distance}</h2>
        </div>

        <div className="controls">
          <button onClick={animateSteps} disabled={isAnimating}>
            {isAnimating ? 'Animating...' : 'Start Animation'}
          </button>
          <button onClick={resetAnimation} disabled={!isAnimating}>
            Reset
          </button>
          <div className="step-info">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {currentStep < steps.length && (
          <div className="step-description">
            <h3>Current Step:</h3>
            <p>{steps[currentStep]?.description}</p>
            {steps[currentStep]?.type === 'calculation' && (
              <div className="calculation-details">
                <p>Characters: '{steps[currentStep].char1}' vs '{steps[currentStep].char2}'</p>
                <p>Cost: {steps[currentStep].cost}</p>
                <p>Deletion: {steps[currentStep].deletion}</p>
                <p>Insertion: {steps[currentStep].insertion}</p>
                <p>Substitution: {steps[currentStep].substitution}</p>
              </div>
            )}
          </div>
        )}

        <div className="matrix-section">
          <h3>Edit Distance Matrix</h3>
          <div className="matrix-container">
            <table className="matrix">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  {str2.split('').map((char, index) => (
                    <th key={index}>{char}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th></th>
                  <th></th>
                  {matrix[0]?.map((value, index) => (
                    <td key={index} className={getCellClass(0, index)}>
                      {value}
                    </td>
                  ))}
                </tr>
                {matrix.slice(1).map((row, i) => (
                  <tr key={i}>
                    <th>{str1[i]}</th>
                    <th>{i}</th>
                    {row.map((value, j) => (
                      <td key={j} className={getCellClass(i + 1, j)}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        
      </main>
    </div>
  );
}

export default App;
