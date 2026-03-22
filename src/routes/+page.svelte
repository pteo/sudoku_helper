<script>
  let activeTab = 'helper'; // 'helper' or 'calculator'
  
  let sumOfNumbers = '';
  let combinationLength = '';
  let numbersToInclude = Array(6).fill('');
  let excludedNumbers = Array(6).fill('');
  let repeatNumbers = false;
  let maxRepeats = 2;
  let results = [];
  let positionSummary = [];
  let validPositionNumbers = [];

  // Calculator variables
  let display = '0';
  let calculationHistory = [];

  $: if (combinationLength && !isNaN(parseInt(combinationLength))) {
    validPositionNumbers = Array(parseInt(combinationLength)).fill('');
  }

  function clearValidPositionNumbers() {
    validPositionNumbers = validPositionNumbers.map(() => '');
  }

  // Calculator functions
  function inputDigit(digit) {
    display = display === '0' ? String(digit) : display + String(digit);
  }

  function clearDisplay() {
    display = '0';
  }

  function backspace() {
    display = display.length > 1 ? display.slice(0, -1) : '0';
  }

  function inputOperator(nextOperator) {
    if (display === '0') {
      if (nextOperator === '-') display = '-';
      return;
    }

    if (/[+\-x÷]$/.test(display)) {
      display = display.slice(0, -1) + nextOperator;
      return;
    }

    if (display.endsWith('(')) return;
    display += nextOperator;
  }

  function inputEquals() {
    if (display === '0' || /[+\-x÷(]$/.test(display)) return;

    const inputExpression = display;
    const expression = display
      .replace(/x/g, '*')
      .replace(/÷/g, '/');

    try {
      const result = Function(`"use strict"; return (${expression});`)();
      if (!Number.isFinite(result)) return;
      const resultString = Number.isInteger(result) ? String(result) : String(Number(result.toFixed(10)));
      calculationHistory = [
        { expression: inputExpression, result: resultString },
        ...calculationHistory
      ].slice(0, 5);
      display = resultString;
    } catch {
      // Keep current display if expression is invalid
    }
  }

  function inputBracket(bracket) {
    if (bracket === '(') {
      if (display === '0') {
        display = '(';
        return;
      }
      if (/\d|\)$/.test(display)) {
        display += 'x(';
        return;
      }
      display += '(';
      return;
    }

    const openCount = (display.match(/\(/g) || []).length;
    const closeCount = (display.match(/\)/g) || []).length;
    if (openCount <= closeCount) return;
    if (/[+\-x÷(]$/.test(display)) return;

    display += ')';
  }

  function input45() {
    display = display === '0' ? '45' : display + '45';
  }

  function generatePermutations() {
    const sum = parseInt(sumOfNumbers);
    const length = parseInt(combinationLength);

    if (sum > 45) { alert("Sum of numbers cannot be greater than 45."); return; }
    if (length > 9) { alert("Combination length cannot be greater than 9."); return; }

    const included = numbersToInclude.map(n => parseInt(n)).filter(n => !isNaN(n));
    const excluded = excludedNumbers.map(n => parseInt(n)).filter(n => !isNaN(n));

    const validPositions = validPositionNumbers.map(pos =>
      pos.split('').map(n => parseInt(n)).filter(n => !isNaN(n))
    );

    const availableNumbers = Array.from({ length: 9 }, (_, i) => i + 1)
      .filter(n => !excluded.includes(n));

    let permutations = [];

    function generate(current, remainingSum, usedCounts = {}) {
      if (current.length === length) {
        if (remainingSum === 0 &&
          included.every(n => current.includes(n)) &&
          current.every((num, pos) =>
            validPositions[pos].length === 0 || validPositions[pos].includes(num)
          )) {
          permutations.push([...current]);
        }
        return;
      }

      const position = current.length;
      const validNumbersForPosition = validPositions[position].length > 0
        ? validPositions[position].filter(n => availableNumbers.includes(n))
        : availableNumbers;

      for (const num of validNumbersForPosition) {
        if (num <= remainingSum) {
          const count = usedCounts[num] || 0;
          if (!repeatNumbers && count > 0) continue;
          if (repeatNumbers && count >= maxRepeats) continue;

          current.push(num);
          usedCounts[num] = count + 1;
          generate(current, remainingSum - num, usedCounts);
          current.pop();
          usedCounts[num] = count;
        }
      }
    }

    generate([], sum);
    results = permutations.sort((a, b) => {
      for (let i = 0; i < length; i++) {
        if (a[i] !== b[i]) return a[i] - b[i];
      }
      return 0;
    });

    positionSummary = Array(length).fill().map((_, position) => {
      const numbersInPosition = new Set(results.map(result => result[position]));
      return Array.from(numbersInPosition).sort((a, b) => a - b);
    });
  }

  $: commonNumbers = results.length > 0 ? findCommonNumbers(results) : [];

  function findCommonNumbers(results) {
    if (results.length === 0) return [];
    let common = results[0];
    for (let i = 1; i < results.length; i++) {
      common = common.filter(number => results[i].includes(number));
    }
    return common;
  }

  function isNumberRemoved(number, position) {
    if (!validPositionNumbers[position]) return false;
    const validNumbers = validPositionNumbers[position]
      .split('')
      .map(n => parseInt(n))
      .filter(n => !isNaN(n));
    return !validNumbers.includes(number);
  }

  function digitsOnly(value) {
    return String(value ?? '').replace(/\D/g, '');
  }

  function appendDigitToFocusedInput(digit) {
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLInputElement)) return;

    const field = activeElement.dataset.field;
    const index = activeElement.dataset.index;

    if (!field) return;

    if (field === 'sumOfNumbers') {
      sumOfNumbers = digitsOnly(sumOfNumbers + digit);
      clearValidPositionNumbers();
      return;
    }

    if (field === 'combinationLength') {
      combinationLength = digitsOnly(combinationLength + digit);
      return;
    }

    if (field === 'maxRepeats') {
      maxRepeats = digitsOnly(String(maxRepeats) + digit);
      return;
    }

    const parsedIndex = Number.parseInt(index, 10);
    if (Number.isNaN(parsedIndex)) return;

    if (field === 'numbersToInclude') {
      numbersToInclude[parsedIndex] = digitsOnly((numbersToInclude[parsedIndex] ?? '') + digit);
      numbersToInclude = [...numbersToInclude];
      return;
    }

    if (field === 'excludedNumbers') {
      excludedNumbers[parsedIndex] = digitsOnly((excludedNumbers[parsedIndex] ?? '') + digit);
      excludedNumbers = [...excludedNumbers];
      return;
    }

    if (field === 'validPositionNumbers') {
      validPositionNumbers[parsedIndex] = digitsOnly((validPositionNumbers[parsedIndex] ?? '') + digit);
      validPositionNumbers = [...validPositionNumbers];
    }
  }

  function backspaceFromFocusedInput() {
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLInputElement)) return;

    const field = activeElement.dataset.field;
    const index = activeElement.dataset.index;

    if (!field) return;

    if (field === 'sumOfNumbers') {
      sumOfNumbers = sumOfNumbers.slice(0, -1);
      clearValidPositionNumbers();
      return;
    }

    if (field === 'combinationLength') {
      combinationLength = combinationLength.slice(0, -1);
      return;
    }

    if (field === 'maxRepeats') {
      maxRepeats = String(maxRepeats).slice(0, -1);
      return;
    }

    const parsedIndex = Number.parseInt(index, 10);
    if (Number.isNaN(parsedIndex)) return;

    if (field === 'numbersToInclude') {
      numbersToInclude[parsedIndex] = (numbersToInclude[parsedIndex] ?? '').slice(0, -1);
      numbersToInclude = [...numbersToInclude];
      return;
    }

    if (field === 'excludedNumbers') {
      excludedNumbers[parsedIndex] = (excludedNumbers[parsedIndex] ?? '').slice(0, -1);
      excludedNumbers = [...excludedNumbers];
      return;
    }

    if (field === 'validPositionNumbers') {
      validPositionNumbers[parsedIndex] = (validPositionNumbers[parsedIndex] ?? '').slice(0, -1);
      validPositionNumbers = [...validPositionNumbers];
    }
  }

  function clearFocusedInput() {
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLInputElement)) return;

    const field = activeElement.dataset.field;
    const index = activeElement.dataset.index;

    if (!field) return;

    if (field === 'sumOfNumbers') {
      sumOfNumbers = '';
      clearValidPositionNumbers();
      return;
    }

    if (field === 'combinationLength') {
      combinationLength = '';
      return;
    }

    if (field === 'maxRepeats') {
      maxRepeats = '';
      return;
    }

    const parsedIndex = Number.parseInt(index, 10);
    if (Number.isNaN(parsedIndex)) return;

    if (field === 'numbersToInclude') {
      numbersToInclude[parsedIndex] = '';
      numbersToInclude = [...numbersToInclude];
      return;
    }

    if (field === 'excludedNumbers') {
      excludedNumbers[parsedIndex] = '';
      excludedNumbers = [...excludedNumbers];
      return;
    }

    if (field === 'validPositionNumbers') {
      validPositionNumbers[parsedIndex] = '';
      validPositionNumbers = [...validPositionNumbers];
    }
  }
</script>

<!-- ✅ Single container, everything inside the white card -->
<div class="container mx-auto px-2 max-w-4xl">
  <div class="bg-white rounded-xl shadow-lg p-6 space-y-4">
    <h1 class="text-3xl font-bold text-primary text-center mb-4 leading-[0.8]">Killer Sudoku Helper</h1>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 mb-6">
      <button 
        class="px-6 py-3 font-medium transition-colors {activeTab === 'helper' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}"
        on:click={() => activeTab = 'helper'}
      >
        Sudoku Helper
      </button>
      <button 
        class="px-6 py-3 font-medium transition-colors {activeTab === 'calculator' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}"
        on:click={() => activeTab = 'calculator'}
      >
        Calculator
      </button>
    </div>

    {#if activeTab === 'helper'}
    <!-- Helper keypad -->
    <div class="helper-keypad-wrap">
      
      <div class="grid grid-cols-5 md:grid-cols-10 gap-2">
        {#each Array.from({ length: 10 }, (_, i) => i) as digit}
          <button
            class="helper-keypad-btn"
            type="button"
            on:mousedown|preventDefault
            on:click={() => appendDigitToFocusedInput(digit)}
          >
            {digit}
          </button>
        {/each}
        <button
          class="helper-keypad-btn helper-keypad-btn-function"
          type="button"
          on:mousedown|preventDefault
          on:click={backspaceFromFocusedInput}
          title="Backspace"
        >
          ⌫
        </button>
        <button
          class="helper-keypad-btn helper-keypad-btn-clear"
          type="button"
          on:mousedown|preventDefault
          on:click={clearFocusedInput}
          title="Clear"
        >
          AC
        </button>
      </div>
    </div>

    <!-- Sum + Length -->
    <div class="grid grid-cols-2 gap-6">
      <label class="block">
        <span class="section-title">Sum of Numbers*</span>
        <input
          type="text"
          inputmode="none"
          data-field="sumOfNumbers"
          bind:value={sumOfNumbers}
          on:input={() => {
            sumOfNumbers = digitsOnly(sumOfNumbers);
            clearValidPositionNumbers();
          }}
          class="input-field"
          pattern="[0-9]*"
          required
        />
      </label>
      <label class="block">
        <span class="section-title">Combination Length*</span>
        <input
          type="text"
          inputmode="none"
          data-field="combinationLength"
          bind:value={combinationLength}
          on:input={() => combinationLength = digitsOnly(combinationLength)}
          class="input-field"
          pattern="[0-9]*"
          required
        />
      </label>
    </div>

    <!-- Numbers to Include + Excluded Numbers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="section-title">Numbers to be Included</h3>
        <div class="grid grid-cols-3 gap-2">
          {#each numbersToInclude as _, i}
            <input
              type="text"
              inputmode="none"
              data-field="numbersToInclude"
              data-index={i}
              bind:value={numbersToInclude[i]}
              on:input={() => {
                numbersToInclude[i] = digitsOnly(numbersToInclude[i]);
                numbersToInclude = [...numbersToInclude];
              }}
              class="input-field"
              placeholder={`Number ${i + 1}`}
              pattern="[0-9]*"
            />
          {/each}
        </div>
      </div>

      <div>
        <h3 class="section-title">Excluded Numbers</h3>
        <div class="grid grid-cols-3 gap-2">
          {#each excludedNumbers as _, i}
            <input
              type="text"
              inputmode="none"
              data-field="excludedNumbers"
              data-index={i}
              bind:value={excludedNumbers[i]}
              on:input={() => {
                excludedNumbers[i] = digitsOnly(excludedNumbers[i]);
                excludedNumbers = [...excludedNumbers];
              }}
              class="input-field"
              placeholder={`Number ${i + 1}`}
              pattern="[0-9]*"
            />
          {/each}
        </div>
      </div>
    </div>

    <!-- Valid Numbers per Position -->
    {#if combinationLength && !isNaN(parseInt(combinationLength))}
      <div>
        <h3 class="section-title">Valid Numbers for Each Position</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          {#each validPositionNumbers as _, i}
            <label class="block">
              <span class="text-sm font-medium text-gray-600">Position {i + 1}</span>
              <input
                type="text"
                inputmode="none"
                data-field="validPositionNumbers"
                data-index={i}
                bind:value={validPositionNumbers[i]}
                on:input={() => {
                  validPositionNumbers[i] = digitsOnly(validPositionNumbers[i]);
                  validPositionNumbers = [...validPositionNumbers];
                }}
                class="input-field"
                placeholder="Enter valid numbers"
                pattern="[0-9]*"
                title="Enter numbers without separators"
              />
            </label>
          {/each}
        </div>
        <p class="text-sm text-gray-500 mt-2">Enter numbers without separators (e.g., "123")</p>
      </div>
    {/if}

    <!-- Repeat Numbers -->
    <div class="space-y-4">
      <label class="flex items-center space-x-2">
        <input type="checkbox" bind:checked={repeatNumbers} class="form-checkbox h-5 w-5 text-blue-600" />
        <span>Repeat Numbers</span>
      </label>
      {#if repeatNumbers}
        <label class="block">
          <span class="section-title">Maximum number repeats allowed</span>
          <input
            type="text"
            inputmode="none"
            data-field="maxRepeats"
            bind:value={maxRepeats}
            on:input={() => maxRepeats = digitsOnly(maxRepeats)}
            class="input-field"
            min="1"
          />
        </label>
      {/if}
    </div>

    <!-- Submit -->
    <button class="btn-primary w-full" on:click={generatePermutations}>
      Show Permutations
    </button>

    <!-- Results -->
    {#if results.length > 0}
      <div class="mt-6 space-y-6">
        {#if commonNumbers.length > 0}
          <div>
            <h3 class="section-title">Numbers Present In All Combinations</h3>
            <div class="flex flex-wrap gap-2">
              {#each commonNumbers as number}
                <span class="bg-green-100 text-green-800 px-2 py-1 rounded">{number}</span>
              {/each}
            </div>
          </div>
        {/if}

        <div>
          <h3 class="section-title">Position Summary</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-1 gap-3">
              {#each positionSummary as numbers, position}
                <div class="flex items-center space-x-2">
                  <span class="font-medium min-w-24">Position {position + 1}:</span>
                  <div class="flex flex-wrap gap-2">
                    {#each numbers as number}
                      <span class="px-2 py-1 rounded">{number}</span>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div>
          <h3 class="section-title">Results ({results.length} combinations found)</h3>
          <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            {#each results as result}
              <div class="py-1 border-b border-gray-200 last:border-0">
                {#each result as number, i}
                  <span class:font-bold={commonNumbers.includes(number)}>
                    {number}{i < result.length - 1 ? ', ' : ''}
                  </span>
                {/each}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
    {/if}

    {#if activeTab === 'calculator'}
    <!-- Calculator -->
    <div class="max-w-sm mx-auto">
      <!-- History -->
      <div class="bg-gray-50 rounded-lg p-3 mb-3 space-y-1 min-h-[120px]">
        {#if calculationHistory.length > 0}
          {#each calculationHistory as item}
            <div class="text-right text-sm text-gray-600 font-mono break-all">
              {item.expression} = {item.result}
            </div>
          {/each}
        {/if}
      </div>

      <!-- Display -->
      <div class="bg-gray-100 rounded-lg p-4 mb-4">
        <div class="text-right text-2xl font-mono break-all">{display}</div>
      </div>

      <!-- Calculator Buttons -->
      <div class="grid grid-cols-4 gap-2">
        <!-- Row 1 -->
        <button on:click={clearDisplay} class="calc-btn calc-btn-function">AC</button>
        <button on:click={input45} class="calc-btn calc-btn-special">45</button>
        <button on:click={backspace} class="calc-btn calc-btn-function">⌫</button>
        <button on:click={() => inputOperator('÷')} class="calc-btn calc-btn-operator">÷</button>

        <!-- Row 2 -->
        <button on:click={() => inputDigit(7)} class="calc-btn">7</button>
        <button on:click={() => inputDigit(8)} class="calc-btn">8</button>
        <button on:click={() => inputDigit(9)} class="calc-btn">9</button>
        <button on:click={() => inputOperator('x')} class="calc-btn calc-btn-operator">x</button>

        <!-- Row 3 -->
        <button on:click={() => inputDigit(4)} class="calc-btn">4</button>
        <button on:click={() => inputDigit(5)} class="calc-btn">5</button>
        <button on:click={() => inputDigit(6)} class="calc-btn">6</button>
        <button on:click={() => inputOperator('-')} class="calc-btn calc-btn-operator">−</button>

        <!-- Row 4 -->
        <button on:click={() => inputDigit(1)} class="calc-btn">1</button>
        <button on:click={() => inputDigit(2)} class="calc-btn">2</button>
        <button on:click={() => inputDigit(3)} class="calc-btn">3</button>
        <button on:click={() => inputOperator('+')} class="calc-btn calc-btn-operator">+</button>

        <!-- Row 5 -->
        <button on:click={() => inputDigit(0)} class="calc-btn">0</button>
        <button on:click={() => inputBracket('(')} class="calc-btn calc-btn-function">(</button>
        <button on:click={() => inputBracket(')')} class="calc-btn calc-btn-function">)</button>
        <button on:click={inputEquals} class="calc-btn calc-btn-equals">=</button>
      </div>
    </div>
    {/if}
  </div>
</div>